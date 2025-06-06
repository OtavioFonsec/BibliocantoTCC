import React from 'react';
import './style.css';
import logo from '/assets/BibliocantoTCC-mainlogo.png';

export default function SobreSite() {
    return (
        <div className='sobre-site-container'>
            <section className='sobre-site-section'>
                <img src={logo} alt="Bibliocanto Logo" className='logoSobreSite' />
                <h1 className='tituloSobreSite'>Sobre o Bibliocanto</h1>

                <div className='conteudoSobreSite'>
                    <p>
                        A plataforma <strong>Bibliocanto</strong> foi criada para oferecer aos leitores uma solução moderna e eficiente no gerenciamento de suas coleções literárias. 
                        Em um cenário cada vez mais digitalizado, o Bibliocanto permite que os usuários organizem suas bibliotecas de forma prática e intuitiva, cadastrando e acessando 
                        livros de maneira rápida e organizada.
                    </p>
                    <p>
                        Além de manter suas coleções em ordem, os usuários podem interagir com uma comunidade de leitores, compartilhando resenhas, opiniões e recomendações. 
                        Essa interação contribui para o fomento da leitura crítica e a troca de conhecimentos, criando um espaço rico para o debate literário.
                    </p>
                    <p>
                        O Bibliocanto visa não apenas a organização pessoal dos acervos, mas também a construção de um ambiente colaborativo, 
                        onde o acesso à informação é facilitado. A plataforma promove a educação de qualidade e incentiva a disseminação de conhecimento, alinhando-se aos objetivos 
                        da Agenda 2030 para o Desenvolvimento Sustentável, em especial no que se refere ao estímulo à leitura e à educação inclusiva.
                    </p>
                </div>
            </section>
        </div>
    );
}