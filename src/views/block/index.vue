<template>
    <div class="div-container">
        <!-- 条件筛选 -->
        <div class="filter-container">
            <el-select placeholder="基地名称" v-model="listQuery.baseName" clearable style="width: 200px" class="filter-item">
                <el-option v-for="item in baseNames" :key="item" :label="item" :value="item" />
            </el-select>
            <el-input placeholder="地块编号" v-model="listQuery.id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select placeholder="种植作物" v-model="listQuery.crop" clearable style="width: 200px" class="filter-item">
                <el-option v-for="item in crops" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select placeholder="品种型号" v-model="listQuery.type" clearable style="width: 200px" class="filter-item">
                <el-option v-for="item in types" :key="item" :label="item" :value="item" />
            </el-select>
            <el-input placeholder="地块描述" v-model="listQuery.id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </div>
        <!-- 列表展示 -->
        <div class="table-container">
            <div class="table-operation">
                <el-button class="table-operation-button" size="mini" icon="el-icon-edit" @click="handleCreate">新增</el-button>
            </div>
            <el-table v-loading="listLoading" :data="list" border fit highlight-current-row stripe style="width: 100%;">
                <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
                <el-table-column label="地块编号" prop="id" align="center" width="90px"></el-table-column>
                <el-table-column label="种植作物" prop="crop" align="center" min-width="100px"></el-table-column>
                <el-table-column label="品种型号" prop="type" align="center" min-width="150px"></el-table-column>
                <el-table-column label="地块描述" prop="description" align="center" min-width="150px"></el-table-column>
                <el-table-column label="操作人" prop="operator" align="center" width="100px"></el-table-column>
                <el-table-column label="操作时间" prop="time" align="center" width="150px">
                    <!--<template slot-scope="scope">
                    <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
</template>-->
        </el-table-column>
        <el-table-column label="操作" prop="operate" align="center" width="220px" fixed="right">
<template slot-scope="scope">
    <el-button v-if="scope.row.operate.indexOf('edit') != -1" size="mini" @click="handleUpdate(scope.row)">
        编辑</el-button>
    <el-button v-if="scope.row.operate.indexOf('view') != -1" size="mini" @click="handleView(scope.row)">查看</el-button>
    <el-button v-if="scope.row.operate.indexOf('delete') != -1" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-wraper">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" :disabled="dialogFormDisabled" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="基地名称" prop="baseName">
          <el-select v-model="listQuery.baseName" class="filter-item" placeholder="" :disabled="true">
            <el-option v-for="item in baseNames" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地块编号" prop="id">
          <el-input v-model="formData.id" placeholder="请输入地块编号"/>
        </el-form-item>
        <el-form-item label="种植作物" prop="crop">
          <el-select v-model="formData.crop" class="filter-item" placeholder="请选择种植作物">
            <el-option v-for="item in crops" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品种型号" prop="type">
          <el-select v-model="formData.type" class="filter-item" placeholder="请选择品种型号">
            <el-option v-for="item in types" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="地块描述" prop="description">
          <el-input :autosize="{ minRows: 8, maxRows: 10}" v-model="formData.description" type="textarea" placeholder="请输入地块描述信息"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleComfirm">确认</el-button>
      </div>
    </el-dialog>

    </div>
</template>

<script>
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
export default {
    name:"block",
    components:{Pagination},
    data() {
        return {
            list: [],
            total: 0,
            listLoading: false,
            textMap: {
                add: '新增地块',
                view: '查看地块',
                edit: '编辑地块'
            },
            dialogStatus: '',
            dialogFormVisible: false,
            dialogFormDisabled: false,
            listQuery: {
                page: 1,
                limit: 10,
                id: "",
                baseName: undefined,
                crop: undefined,
                type: undefined,
                description: undefined,
            },
            //基地名称
            baseNames: [
                '城阳上马', '黑龙江大庆', '东营军马场', '新疆喀什', '陕西延安', '青岛白泥地'
            ],
            //品种型号
            types: [
                'type-1', 'type-2', 'type-3', 'type-4', 'type-5'
            ],
            //庄稼
            crops: [
                'crops', 'crops2', 'crops3'
            ],
            formData: {
                id: '',
                crop: '',
                type: '',
                description: '',
            },
            rules: {
                id: [{ required: true, message: '地块编号是必填项', trigger: 'blur' }],
                baseName: [{ required: true, message: '基地名称是必填项', trigger: 'blur' }],

            },
        };
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            // this.listLoading = true
            // fetchList(this.listQuery).then(response => {
            //   this.list = response.data.items
            //   this.total = response.data.total

            //   setTimeout(() => {
            //     this.listLoading = false
            //   }, 1.5 * 1000)
            // })
            // 模拟请求
            this.listLoading = true
            setTimeout(() => {
                this.listLoading = false
                this.total = 2
                if (this.listQuery.page == 1) {
                    this.list = [
                        { id: 'GD0001', crop: '城阳上马', type: '山东省青岛市城阳区', description: 'hhhhhhhhhhhhhhhhhhhhhhhhh', operator: '张三', time: '2019-2-12 12:00:00', operate: ['edit', 'view', 'delete'] },
                        { id: 'GD0002', name: '阿斯蒂芬阿斯蒂芬', type: '啊手动阀手动阀', description: '红红火火恍恍惚惚红红火火', operator: '阿斯蒂', time: '2019-2-12 12:00:00', operate: ['edit', 'view', 'delete'] },
                    ]
                }
            }, 1.5 * 1000)
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleCreate() {
            this.resetForm()
            this.dialogStatus = 'add'
            this.dialogFormVisible = true
            this.dialogFormDisabled = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleUpdate(row) {
            this.formData = Object.assign({}, row)
            // this.temp.timestamp = new Date(this.temp.timestamp)
            this.dialogStatus = 'edit'
            this.dialogFormVisible = true
            this.dialogFormDisabled = false
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleView(row) {
            this.formData = Object.assign({}, row)
            // this.temp.timestamp = new Date(this.temp.timestamp)
            this.dialogStatus = 'view'
            this.dialogFormVisible = true
            this.dialogFormDisabled = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleReset() {
            this.listQuery = {
                page: 1,
                limit: 10,
                id: '',
                name: undefined,
                adress: undefined,
                description: undefined,
                organization: undefined,
                charge: undefined,
            }
        },
        handleComfirm() {
            switch (this.dialogStatus) {
                case 'add':
                    this.createData()
                    break;
                case 'edit':
                    this.updateData()
                    break;

                default:
                    this.dialogFormVisible = false
                    break;
            }
        },
        resetForm() {
            this.formData = {
                id: '',
                crop: '',
                type: '',
                description: '',
            }
        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // this.temp.author = 'vue-element-admin'
                    // createArticle(this.temp).then(() => {
                    //   this.list.unshift(this.temp)
                    //   this.dialogFormVisible = false
                    //   this.$notify({
                    //     title: '成功',
                    //     message: '创建成功',
                    //     type: 'success',
                    //     duration: 2000
                    //   })
                    // })
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    })
                }
            })
        },
        updateData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // const tempData = Object.assign({}, this.temp)
                    // updateArticle(tempData).then(() => {
                    //   for (const v of this.list) {
                    //     if (v.id === this.temp.id) {
                    //       const index = this.list.indexOf(v)
                    //       this.list.splice(index, 1, this.temp)
                    //       break
                    //     }
                    //   }
                    //   this.dialogFormVisible = false
                    //   this.$notify({
                    //     title: '成功',
                    //     message: '更新成功',
                    //     type: 'success',
                    //     duration: 2000
                    //   })
                    // })
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    })
                }
            })
        },
        handleDelete(id) {
            this.$confirm('确认要删除此基地信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            // const index = this.list.indexOf(row)
            // this.list.splice(index, 1)
        }
    }
};
</script>

<style scoped>

</style>

