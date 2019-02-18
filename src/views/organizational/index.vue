<template>
    <div class="app-container">
        <el-card class="box-card tree-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>组织机构</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleCreate">新增组织</el-button>
            </div>
            <div class="text item">
                <el-input clearable v-model="filterText" placeholder="Filter keyword" style="margin-bottom:10px;" />
                <el-tree ref="tree2" :data="data2" :props="defaultProps" @node-click="nodeClick" :filter-node-method="filterNode" :expand-on-click-node="false" class="filter-tree" default-expand-all />
            </div>
        </el-card>
        <el-card class="box-card table-card" shadow="hover" v-if="tableVisible">
            <div slot="header" class="clearfix">
                <span>{{textMap[dialogStatus]}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleDelete($event)">删除组织</el-button>
            </div>
            <div class="text item" v-loading="listLoading">
                <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
                    <el-form-item label="组织名称" prop="name">
                        <el-input v-model="formData.name" />
                    </el-form-item>
                    <el-form-item label="上级组织" prop="parent">
                        <el-input v-model="formData.parent" />
                    </el-form-item>
                    <el-form-item label="负责人" prop="charge">
                        <el-input v-model="formData.charge" />
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="formData.phone" type="number" />
                    </el-form-item>
    
                    <el-form-item label="机构状态" prop="radio">
                        <el-radio v-model="formData.radio" label="1">启用</el-radio>
                        <el-radio v-model="formData.radio" label="2">禁用</el-radio>
                    </el-form-item>
    
                </el-form>
                <div slot="footer" style="text-align:center">
                    <el-button type="primary" @click="handleComfirm">确认</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
export default {
    name: "organizational",
    components: { Pagination },
    data() {
        return {
            listLoading: false,
            //用于增删改弹框标题
            textMap: {
                add: "新增肥料种类",
                edit: "查看肥料种类"
            },
            formData: {
                name: "",
                parent: "",
                charge: "",
                phone: "",
                status: "",
                radio: "",
            },
            rules: {
                name: [{ required: true, message: "组织名称是必填项", trigger: "blur" }],
                parent: [{ required: true, message: "上级组织是必填项", trigger: "blur" }],
                charge: [{ required: true, message: "负责人是必填项", trigger: "blur" }],
                phone: [{ required: true, message: "联系电话是必填项", trigger: "blur" }],
                radio: [{ required: true, message: "机构状态是必填项", trigger: "blur" }]
            },
            dialogStatus: "",
            filterText: "",
            orgId: "",
            //false是表格不显示
            tableVisible: false,
            defaultProps: {
                children: "children",
                label: "label"
            },
            data2: [{
                    id: 1,
                    label: "Level one 1",
                    children: [{
                        id: 4,
                        label: "Level two 1-1",
                        children: [{
                                id: 9,
                                label: "Level three 1-1-1"
                            },
                            {
                                id: 10,
                                label: "Level three 1-1-2"
                            }
                        ]
                    }]
                },
                {
                    id: 2,
                    label: "Level one 2",
                    children: [{
                            id: 5,
                            label: "Level two 2-1"
                        },
                        {
                            id: 6,
                            label: "Level two 2-2"
                        }
                    ]
                },
                {
                    id: 3,
                    label: "Level one 3",
                    children: [{
                            id: 7,
                            label: "Level two 3-1"
                        },
                        {
                            id: 8,
                            label: "Level two 3-2"
                        }
                    ]
                }
            ]
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 树节点 点击事件
        nodeClick(data) {
            // this.dialogStatus = "edit"
            // this.tableVisible = true;
            this.orgId = data.id;
            this.handleUpdate()
            this.resetForm();
        },
        //重置表单
        resetForm() {
            this.formData = {
                name: "",
                parent: "",
                charge: "",
                phone: "",
                radio: "",
            };
        },
        //新增
        handleCreate() {
            this.resetForm();
            //彈框的標題是新增
            this.dialogStatus = "add";
            this.tableVisible = true;
            this.$nextTick(() => {
                //移除表单项的校验结果
                this.$refs["dataForm"].clearValidate();
            });
        },
        //编辑
        handleUpdate(row) {
            //可以为已有的对象赋予多个新属性
            this.formData = Object.assign({}, row);
            //彈框的標題是编辑
            this.dialogStatus = "edit";
            this.tableVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        //删除
        handleDelete() {
            this.$confirm("确认要删除此条信息么？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$notify({
                        title: "成功",
                        message: "删除成功",
                        type: "success",
                        duration: 2000
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            //  const index = this.list.indexOf(row)
            // this.list.splice(index, 1)
        },
      
        //确认提交
        handleComfirm() {
            switch (this.dialogStatus) {
                case "add":
                    this.createData();
                    break;
                case "edit":
                    this.updateData();
                    break;
                default:
                    this.tableVisible = false;
                    break;
            }
        },
        createData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.tableVisible = false;
                    this.$notify({
                        title: "成功",
                        message: "创建成功",
                        type: "success",
                        duration: 2000
                    });
                }
            });
        },
        updateData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.tableVisible = false;
                    this.$notify({
                        title: "成功",
                        message: "更新成功",
                        type: "success",
                        duration: 2000
                    });
                }
            });
        }
    }
};
</script>

<style scoped>

</style>

