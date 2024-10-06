import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import {Link,usePage} from "@inertiajs/react";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const user = usePage().props.auth.user;
    const user_roles = user.roles[0]?.name;
    var model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') },
                { label: 'Button', icon: 'pi pi-fw pi-id-card', to: route('button') },
                { label: 'User', icon: 'pi pi-fw pi-users', to: route('users.index') },
                { label: 'Role', icon: 'pi pi-fw pi-users', to: route('roles.index') },
            ]
        },
    ];
    // console.log(user.roles[0]?.name);
    switch (user_roles) {
        case 'Admin':
            model = [
                {
                    label: 'Home',
                    items: [
                        // { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') },
                        // { label: 'Button', icon: 'pi pi-fw pi-id-card', to: route('button') },
                        // { label: 'User', icon: 'pi pi-fw pi-users', to: route('users.index') },
                        // { label: 'Role', icon: 'pi pi-fw pi-users', to: route('roles.index') },
                        // { label: 'Exam', icon: 'pi pi-fw pi-users', to: route('exams.index') },
                        // { label: 'Category', icon: 'pi pi-fw pi-users', to: route('category.index') },
                        { label: 'Questions', icon: 'pi pi-fw pi-users', to: route('questions.index') },
                    ]
                },
            ];
            break;
    
        default:
            model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') },
                        // { label: 'Button', icon: 'pi pi-fw pi-id-card', to: route('button') },
                        { label: 'User', icon: 'pi pi-fw pi-users', to: route('users.index') },
                        { label: 'Role', icon: 'pi pi-fw pi-users', to: route('roles.index') },
                    ]
                },
            ];
            break;
    }
    

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ?
                    // <li className="menu-separator">{item.label}</li> 
                    <AppMenuitem item={item} root={true} index={i} key={item.label} /> 
                    : 
                    <li className="menu-separator"></li>;
                })}


            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
