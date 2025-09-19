import { apiGet, saveSession } from "../api.js"; 

export class PantallaLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.renderizar(); }

  renderizar() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{
          display:block;height:100dvh;
          background:linear-gradient(135deg,#283593,#1976d2);
          font-family: system-ui,Segoe UI,Roboto,Arial,sans-serif
        }
        .contenedor{
          height:100%;display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          color:#fff;
          text-align:center;
          padding:16px
        }

        h2{
          margin-bottom:16px;
          font-size:1.8rem;
          font-weight:800
        }

        input{
          margin:10px;
          padding:12px;
          border-radius:10px;
          border:none;
          width:min(320px,92vw);
          font-size:1rem;
          outline:0
        }
        input:focus{
          box-shadow:0 0 0 3px rgba(255,255,255,.35)
        }
        button{
          margin-top:14px;
          padding:12px;
          width:min(340px,92vw);
          border:0;border-radius:999px;
          font-weight:800;
          background:#ffca28;
          color:#283593;
          cursor:pointer
          }

        a{
          margin-top:16px;
          color:#bbdefb;
          cursor:pointer;
          font-size:.95rem;
          text-decoration:underline
        }
      </style>
      <div class="contenedor">
        <h2>Bienvenido</h2>
        <input id="email" type="email" placeholder="tu@correo.com" autocomplete="username" />
        <input id="pass" type="password" placeholder="Contraseña" autocomplete="current-password" />
        <button id="btnLogin">Ingresar</button>
        <a id="forgot">¿Olvidaste tu contraseña?</a>
      </div>
    `;

    this.shadowRoot.getElementById("btnLogin").addEventListener("click", async () => {
      const email = this.shadowRoot.getElementById("email").value.trim();
      const pass  = this.shadowRoot.getElementById("pass").value;
      try {
        const users = await apiGet(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`);
        if (users.length === 1) {
          saveSession(users[0]);
          this.dispatchEvent(new CustomEvent("navegar", { detail: { screen:"dashboard" }, bubbles:true, composed:true }));
        } else {
          alert("Correo o contraseña incorrectos.");
        }
      } catch {
        alert("No se pudo conectar al servidor.");
      }
    });

    this.shadowRoot.getElementById("forgot").addEventListener("click", async (e)=>{
      e.preventDefault();
      const email = prompt("Escribe tu correo para restablecer la contraseña:");
      if(!email) return;
      try{
        const u = await apiGet(`/users?email=${encodeURIComponent(email)}`);
        alert(u.length ? "Te enviamos un correo con instrucciones (demo)." : "No encontramos ese correo.");
      }catch{ alert("Error al solicitar recuperación."); }
    });
  }
}
customElements.define("pantalla-login", PantallaLogin);