
import Entidades from "../pages/entidade/Entidades";
import Contatos from "../pages/contatos/Contatos";
import Cargos from "../pages/cargo/Cargos";
import Usuarios from "../pages/usuario/Usuarios";
import HomePage from "../pages/homepage/HomePage";
import Deslocamentos from "../pages/deslocamento/Deslocamentos";
import Localidades from "../pages/localidade/Localidades";


const admin = "Administrador"
const atendente = "Atendente"
const telefonista = "Telefonista"

const rules = [
    {
        title: 'Dashboard',
        path: "/dashboard",
        perfil: [admin, atendente, telefonista],
        component: HomePage
    },
    {
        title: 'Contatos',
        path: "/contatos",
        perfil: [admin, atendente, telefonista],
        component: Contatos
    },
    {
        title: "Entidades",
        path: "/entidades",
        perfil: [admin],
        component: Entidades
    },   
    
   
    {
        title: 'Deslocamentos',
        path: "/deslocamentos",
        perfil: [admin],
        component: Deslocamentos
    },
    {
        title: "Cargos",
        path: "/cargos",
        perfil: [admin, atendente],
        component: Cargos
    },
    {
        title: 'Localidades',
        path: "/localidades",
        perfil: [admin],
        component: Localidades
    },
    {
        title: 'Usuários',
        path: "/users",
        perfil: [admin],
        component: Usuarios
    }


];

export default rules;
