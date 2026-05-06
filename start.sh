#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 项目端口配置
FRONTEND_PORT=33334
BACKEND_PORT=3001

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

check_port() {
    local port=$1
    lsof -i:$port > /dev/null 2>&1
}

get_process_name() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null | head -1)
    if [ -n "$pid" ]; then
        ps -p $pid -o comm= 2>/dev/null | tr -d ' '
    fi
}

stop_conflict_process() {
    local port=$1
    local service=$2
    
    if check_port $port; then
        echo -e "${YELLOW}[检测]${NC} 端口 ${port} 被占用 (${service})"
        
        PID=$(lsof -ti:$port 2>/dev/null | head -1)
        PROCESS_NAME=$(get_process_name $port)
        
        if [ -n "$PID" ]; then
            echo -e "       ${YELLOW}→${NC} 进程: ${PROCESS_NAME} (PID: ${PID})"
            
            # 只停止Node/Vite相关进程
            if echo "$PROCESS_NAME" | grep -qiE "(node|vite|npm|yarn|pnpm)"; then
                echo -e "       ${YELLOW}→${NC} 停止冲突进程..."
                kill -15 $PID 2>/dev/null
                sleep 1
                
                if ps -p $PID > /dev/null 2>&1; then
                    kill -9 $PID 2>/dev/null
                    sleep 0.5
                fi
                
                if ! check_port $port; then
                    echo -e "       ${GREEN}✓${NC} 冲突进程已停止"
                    return 0
                else
                    echo -e "       ${RED}✗${NC} 停止失败，端口仍被占用"
                    return 1
                fi
            else
                echo -e "       ${YELLOW}→${NC} 非Node/Vite进程，跳过"
                return 1
            fi
        fi
    else
        echo -e "${GREEN}[检查]${NC} 端口 ${port} 空闲 (${service})"
    fi
    return 0
}

check_and_install_dependencies() {
    local target_dir=$1
    local package_file=$2
    local node_modules_dir=$3
    
    if [ -f "$target_dir/$package_file" ]; then
        if [ ! -d "$target_dir/$node_modules_dir" ] || [ -z "$(ls -A "$target_dir/$node_modules_dir" 2>/dev/null)" ]; then
            echo -e "       ${YELLOW}→${NC} 发现缺少依赖，正在安装..."
            cd "$target_dir"
            npm install
            if [ $? -eq 0 ]; then
                echo -e "       ${GREEN}✓${NC} 依赖安装成功"
            else
                echo -e "       ${RED}✗${NC} 依赖安装失败"
                return 1
            fi
        else
            echo -e "       ${GREEN}✓${NC} 依赖已存在"
        fi
    fi
    return 0
}

start_backend() {
    echo -e "${YELLOW}[启动]${NC} 后端服务 (端口 ${BACKEND_PORT})..."
    
    cd "$SCRIPT_DIR/server"
    mkdir -p "$SCRIPT_DIR/logs"
    
    # 检查后端依赖
    echo -e "       ${YELLOW}→${NC} 检查后端依赖..."
    check_and_install_dependencies "$SCRIPT_DIR/server" "package.json" "node_modules"
    
    # 后台启动
    cd "$SCRIPT_DIR/server"
    PORT=${BACKEND_PORT} nohup node index.js > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
    sleep 3
    
    # 检查端口
    if check_port $BACKEND_PORT; then
        BACKEND_PID=$(lsof -i:${BACKEND_PORT} -t)
        echo -e "       ${GREEN}✓${NC} 后端服务已启动 (PID: $BACKEND_PID)"
        return 0
    else
        echo -e "       ${RED}✗${NC} 后端服务启动失败"
        echo -e "       ${RED}→${NC} 查看日志: tail -f $SCRIPT_DIR/logs/backend.log"
        return 1
    fi
}

start_frontend() {
    echo -e "${YELLOW}[启动]${NC} 前端服务 (端口 ${FRONTEND_PORT})..."
    
    # 删除旧的PM2进程
    pm2 delete all 2>/dev/null
    sleep 1
    
    # 如果端口仍被占用，强制杀掉
    if check_port $FRONTEND_PORT; then
        PID=$(lsof -ti:$FRONTEND_PORT 2>/dev/null | head -1)
        if [ -n "$PID" ]; then
            echo -e "       ${YELLOW}→${NC} 强制终止残留进程 (PID: $PID)..."
            kill -9 $PID 2>/dev/null
            sleep 1
        fi
    fi
    
    # 检查前端依赖
    echo -e "       ${YELLOW}→${NC} 检查前端依赖..."
    check_and_install_dependencies "$SCRIPT_DIR" "package.json" "node_modules"
    
    # 使用PM2启动前端
    cd "$SCRIPT_DIR"
    pm2 serve dist ${FRONTEND_PORT} --spa --name blog-frontend &
    sleep 4
    
    # 检查端口
    if check_port $FRONTEND_PORT; then
        FRONTEND_PID=$(lsof -i:${FRONTEND_PORT} -t 2>/dev/null | head -1)
        if [ -n "$FRONTEND_PID" ]; then
            echo -e "       ${GREEN}✓${NC} 前端服务已启动 (PID: $FRONTEND_PID)"
            return 0
        else
            echo -e "       ${RED}✗${NC} 端口被占用，服务启动失败"
            return 1
        fi
    else
        echo -e "       ${RED}✗${NC} 前端服务启动失败"
        return 1
    fi
}

# 步骤1：智能检测和解决冲突
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}        ${GREEN}个人博客系统 - 智能启动脚本 v2.7${NC}           ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}项目端口配置:${NC}"
echo -e "  ${GREEN}前端:${NC}  localhost:${FRONTEND_PORT}  (PM2 Serve + SPA)"
echo -e "  ${GREEN}后端:${NC}  localhost:${BACKEND_PORT}  (Express)"
echo ""
echo -e "${BLUE}[步骤 1/4]${NC} ${CYAN}检测并解决端口冲突${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
BACKEND_PORT_STATUS=0
FRONTEND_PORT_STATUS=0

stop_conflict_process $BACKEND_PORT "后端服务 (Express)" || BACKEND_PORT_STATUS=$?
stop_conflict_process $FRONTEND_PORT "前端服务 (PM2)" || FRONTEND_PORT_STATUS=$?

# 如果端口被非Node进程占用，提示警告但不阻止启动
if [ $FRONTEND_PORT_STATUS -ne 0 ]; then
    echo -e "${YELLOW}⚠${NC} 前端端口 ${FRONTEND_PORT} 被占用，尝试强制重启..."
fi

echo ""

# 步骤2：启动后端
echo -e "${BLUE}[步骤 2/4]${NC} ${CYAN}启动后端服务${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
start_backend
BACKEND_STATUS=$?
echo ""

# 步骤3：启动前端
echo -e "${BLUE}[步骤 3/4]${NC} ${CYAN}启动前端服务${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
start_frontend
FRONTEND_STATUS=$?
echo ""

# 步骤4：保存PM2配置
echo -e "${BLUE}[步骤 4/4]${NC} ${CYAN}保存PM2配置${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
pm2 save
echo ""

# 检查服务状态
sleep 2
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}                    ${GREEN}服务状态检查${NC}                    ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"

if check_port $BACKEND_PORT; then
    echo -e "  ${GREEN}✓${NC} 后端服务 (http://localhost:${BACKEND_PORT})  ${GREEN}运行中${NC}"
else
    echo -e "  ${RED}✗${NC} 后端服务 (http://localhost:${BACKEND_PORT})  ${RED}未运行${NC}"
fi

if check_port $FRONTEND_PORT; then
    echo -e "  ${GREEN}✓${NC} 前端服务 (http://localhost:${FRONTEND_PORT})  ${GREEN}运行中${NC}"
else
    echo -e "  ${RED}✗${NC} 前端服务 (http://localhost:${FRONTEND_PORT})  ${RED}未运行${NC}"
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}                      ${GREEN}访问地址${NC}                       ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo -e "  ${GREEN}前端:${NC}  http://192.3.159.110:${FRONTEND_PORT}"
echo -e "  ${GREEN}后端:${NC}  http://192.3.159.110:${BACKEND_PORT}"
echo -e "  ${GREEN}管理:${NC}  http://192.3.159.110:${FRONTEND_PORT}/admin"
echo ""
echo -e "  ${GREEN}管理员账号:${NC} admin / admin123"
echo ""

# 重启状态
if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ 启动成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 启动过程中出现问题，请检查日志${NC}"
    exit 1
fi
