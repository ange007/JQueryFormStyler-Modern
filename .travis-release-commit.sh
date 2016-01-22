#!/usr/bin/env sh
# encoding: utf-8

DIST_PATH=${TRAVIS_BUILD_DIR}/actual-release
# переходим в директорию
cd ${TRAVIS_BUILD_DIR};
# копируем в неё репозиторий
git clone ${REPO_URL} actual-release;
# переходим в скопированный директорию репозитория, переключаемся в нужную ветку и чистим файлы
cd ${DIST_PATH} && git checkout release && rm -rf *;
# перемещаем файлы
cp -rp ${TRAVIS_BUILD_DIR}/package.json ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/composer.json ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/bower.json ${DIST_PATH};
cp -rp ${TRAVIS_BUILD_DIR}/build/ ${DIST_PATH};
# переходим в директорию добавляе коммит
cd ${DIST_PATH} && git add -A && git commit -am "Автоматическая сборка (${TRAVIS_BUILD_NUMBER})";
# отправляем коммит
git push ${REPO_URL} release;