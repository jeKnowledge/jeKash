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

            <div className="criar-divida-tituloDSC">
                <h1>Dívidas Tech</h1>
            </div>
            <DividasComponent
                color = "#51A450"
                page="Tech"
            />
            {/* Usar o dividas Component para mudar a estetica de como as dividas aparecem
            Por outras palavras, não mexer neste HTML para mudar algo nesta pagina. Mexer no componente.
            */}
        </div>
    )
}

export default DividasShow;