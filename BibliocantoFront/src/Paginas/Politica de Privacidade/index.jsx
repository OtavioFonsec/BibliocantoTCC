import React from 'react';
import './style.css';

export default function PoliticaPrivacidade() {
    return (
        <div className='privacidade-container'>
            <section className='formPrivacidade'>
                <h1 className='h1TituloPrivacidade'>Política de Privacidade</h1>

                <p>
                    A sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos,
                    usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site 
                    <strong> Bibliocanto</strong>. Ao utilizar nossos serviços, você concorda com as práticas descritas 
                    nesta política.
                </p>

                <h2>1. Informações Coletadas</h2>

                <h3>1.1 Informações que Você Fornece Voluntariamente</h3>
                <p>
                    Quando você se registra no site, cria uma conta ou interage com nossos serviços, podemos coletar as 
                    seguintes informações:
                </p>
                <ul>
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Informações de login (nome de usuário, senha)</li>
                </ul>

                <h3>1.2 Informações Coletadas Automaticamente</h3>
                <p>
                    Quando você utiliza nosso site, podemos coletar automaticamente certas informações, incluindo:
                </p>
                <ul>
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Páginas visitadas e tempo gasto em cada página</li>
                    <li>Dados de navegação e interações com o site</li>
                </ul>

                <h2>2. Uso das Informações</h2>
                <p>As informações que coletamos são utilizadas para:</p>
                <ul>
                    <li>Gerenciar e personalizar sua conta e perfil</li>
                    <li>Analisar o uso do site e melhorar nossos serviços</li>
                    <li>Cumprir com obrigações legais</li>
                </ul>

                <h2>3. Compartilhamento de Informações</h2>
                <p>
                    Nós não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes
                    circunstâncias:
                </p>
                <ul>
                    <li><strong>Requisitos Legais:</strong> Podemos divulgar suas informações se formos obrigados por lei ou em resposta a processos judiciais.</li>
                    <li><strong>Proteção de Direitos:</strong> Podemos compartilhar suas informações para proteger nossos direitos, segurança e propriedade.</li>
                </ul>

                <h2>4. Cookies e Tecnologias Semelhantes</h2>
                <p>
                    Nosso site pode utilizar cookies e tecnologias semelhantes para coletar informações de navegação. 
                    Você pode ajustar as configurações do seu navegador para desativar os cookies, mas isso pode limitar 
                    algumas funcionalidades do site.
                </p>

                <h2>5. Segurança dos Dados</h2>
                <p>
                    Adotamos medidas de segurança técnicas e organizacionais para proteger suas informações contra 
                    acessos não autorizados, perda, uso indevido ou divulgação.
                </p>

                <h2>6. Retenção de Dados</h2>
                <p>
                    Suas informações pessoais serão mantidas apenas enquanto forem necessárias para cumprir os propósitos 
                    descritos nesta Política de Privacidade, ou conforme exigido por lei.
                </p>

                <h2>7. Seus Direitos</h2>
                <p>
                    Você tem o direito de:
                </p>
                <ul>
                    <li>Acessar, corrigir ou atualizar suas informações pessoais</li>
                    <li>Solicitar a exclusão de sua conta e dados pessoais</li>
                    <li>Retirar o consentimento para o uso de suas informações</li>
                    <li>Solicitar a restrição ou objeção ao processamento de seus dados pessoais</li>
                </ul>

                <h2>8. Alterações na Política de Privacidade</h2>
                <p>
                    Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você reveja esta 
                    página regularmente para estar informado sobre nossas práticas de privacidade. Quaisquer alterações 
                    entrarão em vigor imediatamente após a publicação da política revisada.
                </p>
                {
                /*
                <h2>9. Contato</h2>
                <p>
                    Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o tratamento de suas 
                    informações pessoais, entre em contato conosco em:
                </p>
                <p>
                    **[Inserir Nome da Empresa/Responsável]**  
                    E-mail: **[inserir e-mail de contato]**  
                    Endereço: **[inserir endereço físico, se aplicável]**
                </p>
                */
                }
            </section>
        </div>
    );
}
