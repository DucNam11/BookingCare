export const adminMenu = [

    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage'
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin'
            // },
            { //quản lý kế hoạch khám bệnh

                name: 'menu.doctor.manage-schedule', link: '/system/manage-schedule'
            }
        ]


    },
    { //quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
        ]
    },
    { //quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
    { //quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
            // { name: 'menu.system.system-parameter.header', link: '/system/system-parameter' },
        ]
    },

];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            { //quản lý kế hoạch khám bệnh

                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'

            },
            { //quản lý bệnh nhân khám bệnh

                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'

            },
            { //quản lý lịch sử khám bệnh

                name: 'menu.doctor.manage-patient-history', link: '/doctor/manage-patient-history'

            },
        ]
    }


];

export const patientMenu = [

    { //quản lý lịch khám bệnh
        name: 'Quản lý',
        menus: [
            {
                name: 'Quản lý lịch khám', link: '/doctor/patient'
            },
        ]
    },


];

