<template>
    <div class="app-container">
        <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 40%" v-model="serchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData" type="warning">重置</el-button>
          <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
          <el-button class="btn-add" size="mini" @click="batchRemove()" type="warning">批量删除</el-button> -->
        </el-row>
      </el-form>
    </div>
    <div class="tools-div">
  
</div>

        <!-- 表格区域 -->
        <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection"/>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/>
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限"/>
        </template>
      </el-table-column>
        </el-table>
        <!-- 工具条 -->
        <div class="tools-div">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
        :disabled="$hasBP('bnt.sysRole.add')  === false">添 加</el-button>
        <el-button class="btn-add" size="mini" @click="batchRemove()" type="warning">批量删除</el-button>
        </div>

    <!-- 分页组件 -->
        <el-pagination
            :current-page="page"
            :total="total"
            :page-size="limit"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="fetchData"
        />

        <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    </div>
</template>


<script>
import api from '@/api/system/sysRole'

    export default{
        //vue代码结构
        data() {
            return {
                list:[],
                page:1,
                limit:5,
                total:0,
                serchObj:{},

                selections:[],
                sysRole:{},
                dialogVisible :false,
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            //跳转到分配菜单的页面
            showAssignAuth(row) {
                //表示路由跳转
            this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
            },
            batchRemove(){
                if(this.selections.length == 0){
                    this.$message.warning('请选择要删除的记录！')
                    return
                }
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() =>{
                    var idList = []
                    //选择的复选框的数据在数组selections里面
                    this.selections.forEach(item =>{
                        var id =item.id
                        idList.push(id)
                    })
                    return api.bantchRemove(idList)
                }).then(response =>{
                    this.$message.success(response.message || '操作成功')
                    this.fetchData()
                })

            },
            handleSelectionChange(selection){
                // 选择了复选框之后，把复选框所在行内容传递
                this.selections = selection
                console.log(selection)
            },
            edit(id){
                this.dialogVisible = true
                this.fetchDataById(id)
            },
            fetchDataById(id){
                api.getById(id).then(response => {
                    this.sysRole = response.data
                })
            },
            update(){
                api.UpdateById(this.sysRole).then(response =>{
                    this.$message.success(response.message || '操作成功')
                    this.dialogVisible = false
                    // 刷新页面
                    this.fetchData()
                })
            },
            add(){
                this.dialogVisible = true;
                this.sysRole={}
            },
            saveOrUpdate(){
                // 根据id进行判断
                if(!this.sysRole.id){
                    this.save();
                }else{
                    this.update();
                }
                },
            save(){
                api.saveRole(this.sysRole).then(response => {
                    this.$message.success(response.message || '操作成功')
                    this.dialogVisible = false
                    // 刷新页面
                    this.fetchData()
                })
            },
            // 删除数据
            removeDataById(id){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // promise
                    // 点击确定，远程调用ajax
                    return api.removeById(id)
                }).then((response) => {
                    this.fetchData(this.page)
                    this.$message.success(response.message || '删除成功')
                })
            },
            resetData() {
                console.log('重置查询表单')
                this.searchObj = {}
                this.fetchData()
            },
            fetchData(current=1) {
                this.page = current
                api.getPageList(this.page,this.limit,this.serchObj)
                .then(response => {
                    this.list = response.data.records
                    this.total = response.data.total
                }
                )
            },
            

            

        },
    
    }
</script>