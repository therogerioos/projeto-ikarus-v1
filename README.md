## Ikarus – Visão Geral Técnica

O **Ikarus** é uma plataforma desktop multiplataforma focada em **gestão de acesso, autenticação segura e controle hierárquico de usuários**, desenvolvida com arquitetura moderna, separação clara de responsabilidades e forte ênfase em segurança, escalabilidade e experiência do usuário.

O sistema é composto por três camadas principais:

* Front-end User
* Front-end Admin
* API de Autenticação e Gestão

---

## Front-end User

O **Front-end User** é responsável pela experiência do usuário final, oferecendo uma interface clara, performática e segura para autenticação e uso das funcionalidades permitidas pelo perfil.

### Tecnologias

* **Tauri 2.0**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Rust**
* **Redux Toolkit**

### Responsabilidades

* Autenticação do usuário via API (login/logout)
* Gerenciamento de sessão utilizando **JWT armazenado em cookies HTTP Only**
* Validação de status de acesso (senha provisória, dispositivo autorizado ou pendente)
* Comunicação direta com a API para consumo de dados autorizados
* Renderização dinâmica de telas conforme permissões do perfil (`USER`, `ADMIN`, `MASTER`)
* Controle de estado global de autenticação e sessão via Redux Toolkit

### Características Técnicas

* Separação clara entre lógica de apresentação e lógica de autenticação
* Proteção de rotas baseada em permissões e estado do token
* Tratamento de fluxos críticos como:

  * Primeiro acesso com senha provisória
  * Dispositivo não autorizado
  * Sessão expirada
* Interface responsiva e consistente, mesmo em ambiente desktop

---

## Front-end Admin

O **Front-end Admin** é destinado a usuários com privilégios administrativos e master, oferecendo ferramentas avançadas de gestão e controle do sistema.

### Tecnologias

* **React**
* **TypeScript**
* **Tailwind CSS**
* **Redux Toolkit**
* **Docker**
* Componentização avançada com foco em reutilização

OBS: Esse front-end será migrado pra Next.js na próxima versão.

### Responsabilidades

* Gestão de usuários e perfis (`USER`, `ADMIN`, `MASTER`)
* Criação e gerenciamento de Organizações (contratos)
* Associação de administradores a organizações
* Visualização e controle de dispositivos vinculados aos usuários
* Aprovação ou bloqueio de dispositivos com status `AUTORIZADO` ou `PENDENTE`
* Configurações avançadas do sistema (credenciais, modos visuais, parâmetros de acesso)

### Características Técnicas

* Interface modular baseada em permissões
* Renderização condicional de componentes administrativos
* Fluxos seguros para ações sensíveis (criação, exclusão, alteração de permissões)
* Integração direta com endpoints protegidos da API
* Uso intensivo de tipagem forte com TypeScript para evitar inconsistências

---

## API – Autenticação e Gestão de Acesso

A **API do Ikarus** é o núcleo do sistema, responsável por toda a lógica de autenticação, autorização, controle de dispositivos e regras de segurança.

### Tecnologias

* **Java**
* **Spring Boot**
* **Spring Security**
* **JWT**
* **MySQL**
* **Docker**

### Responsabilidades

* Autenticação de usuários com validação de credenciais
* Emissão e validação de **JWT via cookies HTTP Only**
* Controle de sessão e logout seguro
* Gestão hierárquica de perfis (`USER`, `ADMIN`, `MASTER`)
* Controle de dispositivos por:

  * UUID
  * Hostname
  * Hash de máquina
* Validação de dispositivos com status:

  * `AUTORIZADO`
  * `PENDENTE`
* Aplicação de regras de segurança para múltiplos dispositivos e duplicidade de hash
* Fluxos de:

  * Primeiro acesso
  * Senha provisória
  * Recuperação e troca de senha via e-mail

### Características Técnicas

* Arquitetura RESTful bem definida
* Separação clara entre Controllers, Services e Repositories
* Regras de negócio centralizadas e testáveis
* Proteção de endpoints baseada em roles e contexto do usuário
* Persistência segura em banco relacional
* Containerização com Docker para facilitar deploy e testes

---

## Diferenciais do Projeto

* Arquitetura completa **end-to-end**
* Foco real em **segurança corporativa**
* Controle avançado de dispositivos
* Separação clara entre experiência do usuário e administração
* Código fortemente tipado e organizado
* Projeto com complexidade real de mercado

