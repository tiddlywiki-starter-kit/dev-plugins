const fs = require('fs');
const path = require('path');

// 指定主目录
const mainDirPath = 'plugins';

function processPluginInfo(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error('读取目录失败:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('获取文件信息失败:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    // 递归处理次级目录
                    processPluginInfo(filePath);
                } else if (file === 'plugin.info') {
                    // 处理 plugin.info 文件
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('读取文件失败:', err);
                            return;
                        }

                        try {
                            const jsonData = JSON.parse(data);
                            // 插入新的值
                            jsonData.stability = 'STABILITY_3_LEGACY';

                            // 写回文件
                            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                                if (err) {
                                    console.error('写入文件失败:', err);
                                } else {
                                    console.log(`成功更新 ${filePath}`);
                                }
                            });
                        } catch (parseErr) {
                            console.error('解析 JSON 失败:', parseErr);
                        }
                    });
                }
            });
        });
    });
}

// 开始处理
processPluginInfo(mainDirPath);
