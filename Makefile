PROJECT = "xgenerate  antd、springboot"

all: build links

build: ;@echo "编译代码....."; \
		npm run build;

links: ;@echo "npm setup xgen....."; \
		npm link;
