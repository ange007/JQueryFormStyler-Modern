#!/usr/bin/env sh
# encoding: utf-8

DIST_PATH=${TRAVIS_BUILD_DIR}/build
# переходим в директорию
cd ${TRAVIS_BUILD_DIR};
# запоминаем в переменную .gitignore и удаляем его
GI=$(cat .gitignore) && rm -rf .gitignore
# переключаемся в текущую ветку
git checkout ${TRAVIS_BRANCH};
# переходим в директорию добавляе коммит
git add -A && git commit -am "Travis build ${TRAVIS_BUILD_NUMBER}";
# отправляем коммит
git push ${REPO_URL} ${TRAVIS_BRANCH};
# возвращаем .gitignore
echo "${GI}" > .gitignore