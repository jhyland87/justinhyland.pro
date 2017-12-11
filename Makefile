#!/usr/bin/make -f
SHELL = /bin/bash

OS := $(shell uname)

bin_list := node npm ls
bin_paths := $(foreach bin,$(bin_list),$(shell which $(bin)))

bin_list_count := $(words $(bin_list))
bin_path_count := $(words $(bin_paths))

MODULES="module1 module2 module3\
module4 mod5 mod6\
mod7 module8 module9"


define modules:
	echo <<EOF
	module1 module2 module3
	module4 mod5 mod6
	mod7 module8 module9
	EOF
endef

npm_version:
	@echo 
all: verify_all
	@echo "Doing ALL!.."

install: verify_all
	npm install

uninstall: verify_all
	npm install

update: verify_all
	npm update

show_stuff:
	$(warning this the warning msg)
	$(info this the info msg)
	$(error this is the error message that will stop the build process)

verify_all: verify_bins
do_upper := @echo match $(if $(filter $(2),1),UPPER FIRST,DONT UPPER)
define show_cols
	
	#awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1'

	@echo $(do_upper)
	@echo -e "$(1)" | column -t
endef

check: verify_all

verify_bins:
ifeq ($(shell test $(bin_list_count) -gt $(bin_path_count); echo $$?),0)
	@echo "Not all bins found"
else
	@echo "All bins found"
endif
	$(info Binary Files Required ($(bin_list_count)): $(bin_list))
	$(info Binary Files Found ($(bin_path_count)): $(bin_paths))

do_cols:
	$(call show_cols,foo bar baz\nbang quux test,1)

.PHONY: all