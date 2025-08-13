#!/bin/bash

# 最终修复脚本

# 1. 删除冗余的 title = "" 行
sed -i '' '/childNoteAtoB\.title = "";/d' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js
sed -i '' '/childNoteBtoA\.title = "";/d' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js
sed -i '' '/childNote\.title = "";/d' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js
sed -i '' '/childNote2\.title = "";/d' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js

# 2. 添加 null 检查 - 第一个子卡片（等价证明正向）
sed -i '' '12771,12774s/^        const childNoteAtoB.*/        const childNoteAtoB = MNNote.new({ title: "" });\
        if (childNoteAtoB) {/' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js
sed -i '' '12775a\
        }' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js

# 3. 添加 null 检查 - 第二个子卡片（等价证明反向）
sed -i '' '12779,12782s/^        const childNoteBtoA.*/        const childNoteBtoA = MNNote.new({ title: "" });\
        if (childNoteBtoA) {/' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js
sed -i '' '12783a\
        }' /Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon-proof-templates/mnutils/xdyyutils.js

echo "修复完成！"
echo "1. 已删除冗余的 title 设置"
echo "2. 已添加 null 检查"