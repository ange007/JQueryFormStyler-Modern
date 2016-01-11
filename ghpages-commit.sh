#!/usr/bin/env bash
DIST_PATH=${TRAVIS_BUILD_DIR}/gh-pages
# переходим в директорию
cd ${TRAVIS_BUILD_DIR};
# копируем в неё репозиторий
git clone ${REPO_URL} gh-pages;
# переходим в скопированный директорию репозитория, переключаемся в нужную ветку и чистим файлы
cd ${DIST_PATH} && git checkout gh-pages && rm -rf *;
# перемещаем файлы
cp -rp ${TRAVIS_BUILD_DIR}/demo/* ${DIST_PATH}
cp -rp ${TRAVIS_BUILD_DIR}/build/ ${DIST_PATH}
# переходим в директорию добавляе коммит
cd ${DIST_PATH} && git add -A && git commit -am "Travis build ${TRAVIS_BUILD_NUMBER}";
# отправляем коммит
git push ${REPO_URL} gh-pages;