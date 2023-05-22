import request from '@/utils/request'
// 固定值 const
const api_name = '/admin/system/sysRole'

export default {
    getRoles(adminId) {
        return request({
            url: `${api_name}/toAssign/${adminId}`,
            method: 'get'
        })
    },

    assignRoles(assginRoleVo) {
        return request({
            url: `${api_name}/doAssign`,
            method: 'post',
            data: assginRoleVo
        })
    },

    //角色列表-条件分页查询
    getPageList(current, limit, serchObj) {
        return request({
            url: `${api_name}/${current}/${limit}`,
            method: 'get',
            // 如果普通对象参数写法 params:对象参数传递
            // 如果使用json格式传递，data:对象参数传递
            params: serchObj
        })
    },

    removeById(id) {
        return request({
            url: `${api_name}/remove/${id}`,
            method: 'delete'
        })
    },

    saveRole(role) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: role
        })
    },
    // 查找id
    getById(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: 'get',
        })
    },
    UpdateById(role) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data: role
        })
    },
    // 批量删除
    bantchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    }




}