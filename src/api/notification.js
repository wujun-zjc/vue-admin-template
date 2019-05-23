import request from '@/utils/request'

export function getTableData(params, current_page, page_size) {
    return request({
        url: '/messageInterfaceService/getPageList',
        method: 'post',
        data: {
            status: params,
            current_page: current_page,
            page_size: page_size
        }
    })
}
export function infoDelete(params) {
    return request({
        url: '/messageInterfaceService/delete',
        method: 'post',
        data: {
            id: params
        }
    })
}
export function deleteList(params) {
    return request({
        url: '/messageInterfaceService/deleteList',
        method: 'post',
        data: params
    })
}


export function readed(params) {
    return request({
        url: '/messageInterfaceService/read',
        method: 'post',
        data: {
            id: params
        }
    })
}
export function readeds(params) {
    return request({
        url: '/messageInterfaceService/reads',
        method: 'post',
        data: params
    })
}
export function readSelect(params) {
    return request({
        url: '/messageInterfaceService/readList',
        method: 'post',
        data: params
    })
}