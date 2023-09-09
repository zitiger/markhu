#!/bin/bash
# 修改版本号
# 运行示例: sh version.sh 0.0.1

# update package.json version
function update_package_version() {
   local version=$1
   local file_path='package.json'
   local file_content=$(cat $file_path)
   local new_file_content=$(echo "$file_content" | sed -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$version\"/")
   echo "$new_file_content" > $file_path
}

# update tauri.conf.json version
function update_tauri_conf_version() {
   local version=$1
   local file_path='src-tauri/tauri.conf.json'
   local file_content=$(cat $file_path)
   local new_file_content=$(echo "$file_content" | sed -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$version\"/")
   echo "$new_file_content" > $file_path
}

# update cargo.toml version
function update_cargo_version() {
   local version=$1
   local file_path='src-tauri/Cargo.toml'
   local file_content=$(cat $file_path)
   local new_file_content=$(echo "$file_content" | sed -E "s/^version = \"[0-9]+\.[0-9]+\.[0-9]+\"/version = \"$version\"/")
   echo "$new_file_content" > $file_path
}

# 执行
update_package_version $1
update_tauri_conf_version $1
update_cargo_version $1

version="v$1"  # 在 $1 前添加前缀 'v'
git tag $version  # 运行 git tag 命令，使用拼接后的版本号
git push --tags
