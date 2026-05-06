#!/bin/bash

# 数据库自动备份脚本
# 建议添加到 crontab:
# crontab -e
# 添加: 0 2 * * * /path/to/backup.sh
# 表示每天凌晨2点自动备份

BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H:%M:%S)
DB_PATH="./data/blog.db"
MAX_BACKUPS=30

echo "📦 开始备份数据库..."

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
if [ -f "$DB_PATH" ]; then
    BACKUP_FILE="$BACKUP_DIR/blog-backup-$DATE.db"
    cp $DB_PATH $BACKUP_FILE
    gzip $BACKUP_FILE
    echo "✅ 数据库已备份: $BACKUP_FILE.gz"
else
    echo "❌ 数据库文件不存在"
    exit 1
fi

# 备份上传的图片
if [ -d "./uploads" ]; then
    UPLOAD_BACKUP="$BACKUP_DIR/uploads-$DATE.tar.gz"
    tar -czf $UPLOAD_BACKUP ./uploads/
    echo "✅ 图片已备份: $UPLOAD_BACKUP"
fi

# 删除旧备份（保留最近30个）
echo "🧹 清理旧备份..."
cd $BACKUP_DIR
ls -t blog-backup-*.db.gz 2>/dev/null | tail -n +$((MAX_BACKUPS+1)) | xargs -r rm -f
ls -t uploads-*.tar.gz 2>/dev/null | tail -n +$((MAX_BACKUPS+1)) | xargs -r rm -f

# 显示备份统计
BACKUP_COUNT=$(ls -1 blog-backup-*.db.gz 2>/dev/null | wc -l)
echo "📊 当前备份数量: $BACKUP_COUNT"

echo ""
echo "════════════════════════════════════════════════════"
echo "🎉 备份完成！"
echo ""
echo "📁 备份目录: $BACKUP_DIR"
echo "💾 备份文件:"
ls -lh $BACKUP_DIR/blog-backup-*.db.gz 2>/dev/null | tail -5
echo "════════════════════════════════════════════════════"
