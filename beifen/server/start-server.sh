#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/logs"

# 项目端口配置
FRONTEND_PORT=3000
BACKEND_PORT=3001
UPLOAD_PORT=33333  # 生产环境上传服务端口

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}        ${GREEN}个人博客系统 - 智能启动脚本 v2.4${NC}           ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}项目端口配置:${NC}"
echo -e "  ${GREEN}前端:${NC}  localhost:${FRONTEND_PORT}  (Vite)"
echo -e "  ${GREEN}后端:${NC}  localhost:${BACKEND_PORT}  (Express)"
echo -e "  ${GREEN}上传:${NC}  localhost:${UPLOAD_PORT}  (上传服务，可选)"
echo ""

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
                echo -e "       ${YELLOW}→${NC} 如需强制停止，请手动处理: kill -9 ${PID}"
                return 1
            fi
        fi
    else
        echo -e "${GREEN}[检查]${NC} 端口 ${port} 空闲 (${service})"
    fi
    return 0
}

start_backend() {
    echo -e "${YELLOW}[启动]${NC} 后端服务 (端口 ${BACKEND_PORT})..."
    
    cd "$SCRIPT_DIR"
    mkdir -p "$LOG_DIR"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo -e "       ${YELLOW}→${NC} 安装后端依赖..."
        npm install > "$LOG_DIR/npm-install-backend.log" 2>&1
        if [ $? -ne 0 ]; then
            echo -e "       ${RED}✗${NC} 依赖安装失败"
            return 1
        fi
    fi
    
    # 后台启动
    cd "$SCRIPT_DIR"
    PORT=${BACKEND_PORT} nohup node index.js > "$LOG_DIR/backend.log" 2>&1 &
    sleep 3
    
    # 检查端口
    if check_port $BACKEND_PORT; then
        BACKEND_PID=$(lsof -i:${BACKEND_PORT} -t)
        echo -e "       ${GREEN}✓${NC} 后端服务已启动 (PID: $BACKEND_PID)"
        return 0
    else
        echo -e "       ${RED}✗${NC} 后端服务启动失败"
        echo -e "       ${RED}→${NC} 查看日志: tail -f $LOG_DIR/backend.log"
        return 1
    fi
}

start_frontend() {
    echo -e "${YELLOW}[启动]${NC} 前端服务 (端口 ${FRONTEND_PORT})..."
    
    cd "$PROJECT_DIR"
    mkdir -p "$LOG_DIR"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo -e "       ${YELLOW}→${NC} 安装前端依赖..."
        npm install > "$LOG_DIR/npm-install-frontend.log" 2>&1
        if [ $? -ne 0 ]; then
            echo -e "       ${RED}✗${NC} 依赖安装失败"
            return 1
        fi
    fi
    
    # 后台启动
    cd "$PROJECT_DIR"
    NODE_ENV=development nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    sleep 5
    
    # 检查端口
    if check_port $FRONTEND_PORT; then
        FRONTEND_PID=$(lsof -i:${FRONTEND_PORT} -t)
        echo -e "       ${GREEN}✓${NC} 前端服务已启动 (PID: $FRONTEND_PID)"
        return 0
    else
        echo -e "       ${RED}✗${NC} 前端服务启动失败"
        echo -e "       ${RED}→${NC} 查看日志: tail -f $LOG_DIR/frontend.log"
        return 1
    fi
}

start_upload_service() {
    echo -e "${YELLOW}[启动]${NC} 上传服务 (端口 ${UPLOAD_PORT})..."
    
    # 检查upload服务是否需要独立启动
    # 如果.env.production中配置了VITE_UPLOAD_BASE_URL使用33333端口，则需要启动独立服务
    # 否则上传服务由后端在BACKEND_PORT统一处理
    
    if check_port $UPLOAD_PORT; then
        echo -e "       ${GREEN}✓${NC} 上传服务已在端口 ${UPLOAD_PORT} 运行，跳过"
        return 0
    else
        echo -e "       ${YELLOW}→${NC} 上传服务无需独立启动（由后端处理）"
        echo -e "       ${GREEN}✓${NC} 上传服务配置完成"
        return 0
    fi
}

# 创建日志目录
mkdir -p "$LOG_DIR"

# 步骤1：智能检测和解决冲突
echo -e "${BLUE}[步骤 1/4]${NC} ${CYAN}检测并解决端口冲突${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
stop_conflict_process $BACKEND_PORT "后端服务 (Express)" || true
stop_conflict_process $FRONTEND_PORT "前端服务 (Vite)" || true
stop_conflict_process $UPLOAD_PORT "上传服务" || true
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

# 步骤4：配置上传服务
echo -e "${BLUE}[步骤 4/4]${NC} ${CYAN}配置上传服务${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
start_upload_service
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
    echo -e "  ${YELLOW}○${NC} 前端服务 (http://localhost:${FRONTEND_PORT})  ${YELLOW}启动中...${NC}"
    echo -e "         (Vite首次启动可能需要10-30秒)"
fi

if check_port $UPLOAD_PORT; then
    echo -e "  ${GREEN}✓${NC} 上传服务 (http://localhost:${UPLOAD_PORT})  ${GREEN}运行中${NC}"
else
    echo -e "  ${GREEN}✓${NC} 上传服务 (由后端统一处理)  ${GREEN}就绪${NC}"
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}                      ${GREEN}访问地址${NC}                       ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo -e "  ${GREEN}前端:${NC}  http://localhost:${FRONTEND_PORT}"
echo -e "  ${GREEN}后端:${NC}  http://localhost:${BACKEND_PORT}"
echo -e "  ${GREEN}API :${NC}  http://localhost:${BACKEND_PORT}/api/articles"
echo -e "  ${GREEN}上传:${NC}  http://localhost:${BACKEND_PORT}/uploads/*"
echo ""

# 生产环境外部访问
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}                   ${YELLOW}外部访问地址${NC}                      ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo -e "  ${GREEN}前端:${NC}  http://192.3.159.110:${FRONTEND_PORT}"
echo -e "  ${GREEN}后端:${NC}  http://192.3.159.110:${BACKEND_PORT}"
echo -e "  ${GREEN}上传:${NC}  http://192.3.159.110:${BACKEND_PORT}/uploads/*"
echo ""

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}                       ${YELLOW}日志文件${NC}                       ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo -e "  ${GREEN}后端:${NC}  tail -f $LOG_DIR/backend.log"
echo -e "  ${GREEN}前端:${NC}  tail -f $LOG_DIR/frontend.log"
echo ""

# 重启状态
if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ 启动成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 启动过程中出现问题，请检查日志${NC}"
    exit 1
fi
