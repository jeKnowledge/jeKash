import React from 'react';
import DividasComponent from './components/DividasShowComponent';
import TopBar from './components/TopBar'

const DividasShow = () => {
    return (
        <div id="bg">
            <TopBar
                color ="normalTopBarCOLOR"
                height = "11vh" //parece ser 18 na sidebar (13% é o normal)
                linkto="/home"
                logo = "normal"
            />
            

            <div className="criar-divida-titulo">
                <h1>Dívidas Inovação</h1>
            </div>
            <DividasComponent
                color = "#FCC17A"
                page = "Innovation"
            />
            {/* Usar o dividas Component para mudar a estetica de como as dividas aparecem
            Por outras palavras, não mexer neste HTML para mudar algo nesta pagina. Mexer no componente.
            */}

            {/* Os três pontinhos é uma libraria */}

            {/*fazer um get das dividas inátivas (Pago) e mandar como parametro o departamento
               fazer um get das dividas ativas (Por pagar) e mandar como parametro o departamento
            */}
        </div>
    )
}

export default DividasShow;