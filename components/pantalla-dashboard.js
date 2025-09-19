import { apiGet, getSession, clearSession } from "../api.js";

export class PantallaDashboard extends HTMLElement {
  constructor(){ super(); this.attachShadow({ mode:"open" }); }
  connectedCallback(){ this.render(); this.load(); }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
        :host{
            display:block;
            min-height:100dvh;
            background:linear-gradient(135deg,#f5f7fa,#c3cfe2);
            font-family: system-ui,Segoe UI,Roboto,Arial,sans-serif
        }
        
        .encabezado{
            position:sticky;top:0;
            display:flex;
            justify-content:space-between;align-items:center;
            padding:12px 16px;background:#283593;color:#fff;
            font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.2)}
            .btn{background:transparent;
            border:1px solid rgba(255,255,255,.6);
            border-radius:999px;
            color:#fff;
            padding:8px 12px;
            cursor:pointer
        }

        main{
            display:grid;gap:18px;
            padding:16px
        }

        h2{
            margin:.25rem 0
        }

        ul{
            list-style:none;
            margin:0;
            padding:0;
            display:grid;
            gap:12px
        }

        .item{
            display:flex;
            justify-content:space-between;
            align-items:center;
            background:#fff;
            border-radius:14px;
            padding:14px;
            box-shadow:0 4px 10px rgba(0,0,0,.08)
        }

        .item small{
            color:#5f6b7a
        }

        .offers{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px
        }

        .offer{
            background:#fff;
            border-radius:14px;
            padding:12px;
            box-shadow:0 4px 10px rgba(0,0,0,.08);
            display:grid;
            gap:6px;
            border-left:8px solid #00a1e0
        }

        .bank{
            font-size:.8rem;
            color:#5f6b7a
        }
            
        @media(min-width:768px){ 
            main{
                grid-template-columns:1fr 1fr
            } 
            .offers{
                grid-template-columns:repeat(3,1fr)
            } 
        }
      </style>

      <div class="encabezado">
        <span>DASHBOARD</span>
        <button id="logout" class="btn">Salir</button>
      </div>

      <main>
        <section>
          <h2>Tus cuentas</h2>
          <ul id="accounts"></ul>
        </section>
        <section>
          <h2>Ofertas</h2>
          <div id="offers" class="offers"></div>
        </section>
      </main>
    `;
    this.shadowRoot.getElementById("logout").onclick = () => {
      clearSession();
      this.dispatchEvent(new CustomEvent("navegar", { detail:{screen:"login"}, bubbles:true, composed:true }));
    };
  }

  async load(){
    const user = getSession();
    if(!user){ this.dispatchEvent(new CustomEvent("navegar", { detail:{screen:"login"}, bubbles:true, composed:true })); return; }

    try{
      const [accounts, offers] = await Promise.all([
        apiGet(`/accounts?userId=${user.id}`),
        apiGet(`/offers`)
      ]);

      const $acc = this.shadowRoot.getElementById("accounts");
      accounts.forEach(a=>{
        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `
          <div><strong>${a.alias}</strong><br><small>${a.number} · ${a.currency}</small></div>
          <div style="text-align:right">
            <div><strong>$${a.balance.toLocaleString("es-MX",{minimumFractionDigits:2})}</strong></div>
            <button class="btn" data-id="${a.id}">Ver</button>
          </div>`;
        li.querySelector("button").onclick = () => {
          this.dispatchEvent(new CustomEvent("navegar", { detail:{screen:"detalle", params:{type:"account", id:a.id}}, bubbles:true, composed:true }));
        };
        $acc.appendChild(li);
      });

      const $offers = this.shadowRoot.getElementById("offers");
      offers.forEach(o=>{
        const art = document.createElement("article");
        art.className = "offer";
        art.style.borderLeftColor = o.color || "#00a1e0";
        art.innerHTML = `
          <div class="bank">${o.bank}</div>
          <strong>${o.title}</strong>
          <p style="margin:0">${o.description}</p>
          <button class="btn" style="border-color:#ddd;color:#283593;background:#f7f8fa">Ver más</button>`;
        art.querySelector("button").onclick = () => {
          this.dispatchEvent(new CustomEvent("navegar", { detail:{screen:"detalle", params:{type:"offer", id:o.id}}, bubbles:true, composed:true }));
        };
        $offers.appendChild(art);
      });
    }catch(e){
      console.error(e);
      alert("No se pudieron cargar tus datos.");
    }
  }
}
customElements.define("pantalla-dashboard", PantallaDashboard);
