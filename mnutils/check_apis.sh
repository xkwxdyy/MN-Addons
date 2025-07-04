#!/bin/bash

# 设置路径
MNUTILS_JS="/Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/mnutils/mnutils.js"
XDYYUTILS_JS="/Users/xiakangwei/Nutstore/Github/repository/MN-addon-develop/MN-Addon/mnutils/xdyyutils.js"

echo "## 不存在的 API 列表"
echo ""

# Menu 类方法
echo "### Menu 类"
grep -q "addMenuItem" "$MNUTILS_JS" || echo "- addMenuItem（文档中有，源码中无）"
grep -q "addMenuItems" "$MNUTILS_JS" || echo "- addMenuItems（文档中有，源码中无）"
grep -q "insertMenuItem" "$MNUTILS_JS" || echo "- insertMenuItem（文档中有，源码中无）"
grep -q "insertMenuItems" "$MNUTILS_JS" || echo "- insertMenuItems（文档中有，源码中无）"
grep -q "show" "$MNUTILS_JS" || echo "- show（文档中有，源码中无）"
grep -q "dismiss" "$MNUTILS_JS" || echo "- dismiss（文档中有，源码中无）"
grep -q "static item" "$MNUTILS_JS" || echo "- static item（文档中有，源码中无）"
grep -q "static dismissCurrentMenu" "$MNUTILS_JS" || echo "- static dismissCurrentMenu（文档中有，源码中无）"

echo ""
echo "### MNUtil 类"
# MNUtil 重要方法检查
grep -q "static select" "$MNUTILS_JS" || echo "- static select（文档中有，源码中无）"
grep -q "static selectIndex" "$MNUTILS_JS" || echo "- static selectIndex（文档中有，源码中无）"
grep -q "static waitHUD" "$MNUTILS_JS" || echo "- static waitHUD（文档中有，源码中无）"
grep -q "static stopHUD" "$MNUTILS_JS" || echo "- static stopHUD（文档中有，源码中无）"
grep -q "static render" "$MNUTILS_JS" || echo "- static render（文档中有，源码中无）"
grep -q "static createJsonEditor" "$MNUTILS_JS" || echo "- static createJsonEditor（文档中有，源码中无）"
grep -q "static getRandomElement" "$MNUTILS_JS" || echo "- static getRandomElement（文档中有，源码中无）"
grep -q "static moveElement" "$MNUTILS_JS" || echo "- static moveElement（文档中有，源码中无）"
grep -q "static countWords" "$MNUTILS_JS" || echo "- static countWords（文档中有，源码中无）"
grep -q "static importNotebook" "$MNUTILS_JS" || echo "- static importNotebook（文档中有，源码中无）"

echo ""
echo "### MNNote 类"
# MNNote 方法检查
grep -q "static new" "$MNUTILS_JS" || echo "- static new（文档中有，源码中无）"
grep -q "static getFocusNote" "$MNUTILS_JS" || echo "- static getFocusNote（文档中有，源码中无）"
grep -q "static getFocusNotes" "$MNUTILS_JS" || echo "- static getFocusNotes（文档中有，源码中无）"
grep -q "static getSelectedNotes" "$MNUTILS_JS" || echo "- static getSelectedNotes（文档中有，源码中无）"
grep -q "open()" "$MNUTILS_JS" || echo "- open()（文档中有，源码中无）"
grep -q "copy()" "$MNUTILS_JS" || echo "- copy()（文档中有，源码中无）"
grep -q "paste()" "$MNUTILS_JS" || echo "- paste()（文档中有，源码中无）"
grep -q "delete(" "$MNUTILS_JS" || echo "- delete()（文档中有，源码中无）"
grep -q "clone()" "$MNUTILS_JS" || echo "- clone()（文档中有，源码中无）"
grep -q "merge(" "$MNUTILS_JS" || echo "- merge()（文档中有，源码中无）"

echo ""
echo "### MNComment 类"
grep -q "static from" "$MNUTILS_JS" || echo "- static from（文档中有，源码中无）"
grep -q "static getCommentType" "$MNUTILS_JS" || echo "- static getCommentType（文档中有，源码中无）"
grep -q "static getTypeByIndex" "$MNUTILS_JS" || echo "- static getTypeByIndex（文档中有，源码中无）"

echo ""
echo "### 检查 xdyyutils.js 中的扩展"
echo "### MNNote.prototype 扩展"
grep -q "getIncludingCommentIndex" "$XDYYUTILS_JS" || echo "- getIncludingCommentIndex（文档中有，源码中无）"
grep -q "getIncludingHtmlCommentIndex" "$XDYYUTILS_JS" || echo "- getIncludingHtmlCommentIndex（文档中有，源码中无）"
grep -q "getTextCommentsIndexArr" "$XDYYUTILS_JS" || echo "- getTextCommentsIndexArr（文档中有，源码中无）"

echo ""
echo "验证完成"