import { apiGet, getSession } from "../api.js"; 

export class PantallaDetalle extends HTMLElement {
  constructor(){ super(); this.attachShadow({ mode:"open" }); }
  connectedCallback(){ this.render(); this.load(); }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
        :host{
            display:block;
            min-height:100dvh;
            background:linear-gradient(135deg,#fdfbfb,#ebedee);
            font-family: system-ui,Segoe UI,Roboto,Arial,sans-serif
            }

        .encabezado{
            position:sticky;
            top:0;display:flex;
            justify-content:space-between;
            align-items:center;padding:12px 16px;
            background:#283593;
            color:#fff;font-weight:800;
            box-shadow:0 2px 6px rgba(0,0,0,.2)
        }

        main{
            padding:16px
            display:grid;
            gap:18px
        }

        .summary{
            background:#fff;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,.08);
            padding:16px;display:grid;gap:6px
        }

        .balance{   
            font-size:28px;font-weight:900;
            color:#283593
        }

        h3{
            margin:0
        }

        .ops{
            display:grid;
            gap:10px
        }

        .ops-grid{
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:10px
        }

        .chip{
            display:grid;
            place-items:center;
            height:64px;
            background:#fff;
            border-radius:50%;
            box-shadow:0 4px 12px rgba(0,0,0,.08);
            font-size:12px
        }

      </style>
      <div class="encabezado">
        <button id="back" class="btn" style="background:transparent;border:0;color:#fff;font-size:18px">←</button>
        <span id="title">Detalle</span>
        <span style="opacity:.4">☰</span>
      </div>
      <main>
        <section id="summary" class="summary"></section>
        <section id="ops" class="ops">
          <h3>Operaciones frecuentes</h3>
          <div id="grid" class="ops-grid"></div>
        </section>
      </main>
    `;
    this.shadowRoot.getElementById("back").onclick = () =>
      this.dispatchEvent(new CustomEvent("navegar", { detail:{screen:"dashboard"}, bubbles:true, composed:true }));
  }

  async load(){
    const user = getSession();
    if(!user){ this.dispatchEvent(new CustomEvent("navegar", { detail:{screen:"login"}, bubbles:true, composed:true })); return; }

    const { type, id } = this.routeParams || {}; 
    const $title = this.shadowRoot.getElementById("title");
    const $sum   = this.shadowRoot.getElementById("summary");
    const $grid  = this.shadowRoot.getElementById("grid");
    const $ops   = this.shadowRoot.getElementById("ops");

    try{
      if(type === "account"){
        const acc = await apiGet(`/accounts/${id}`);
        $title.textContent = acc.alias;
        $sum.innerHTML = `
          <h3>${acc.alias}</h3>
          <div>${acc.number} · ${acc.currency}</div>
          <div class="balance">$${acc.balance.toLocaleString("es-MX",{minimumFractionDigits:2})}</div>`;
        this.renderOps(acc.frequentOps || [], $grid, $ops);
      }else if(type === "offer"){
        const offer = await apiGet(`/offers/${id}`);
        $title.textContent = offer.bank;
        $sum.innerHTML = `<h3>${offer.title}</h3><p style="margin:0">${offer.description}</p>`;
        this.renderOps(["Contratar","Saber más","Contactar"], $grid, $ops);
      }else{
        $sum.textContent = "Parámetros inválidos.";
        $ops.style.display = "none";
      }
    }catch(e){
      console.error(e);
      $sum.textContent = "No se pudo cargar el detalle.";
      $ops.style.display = "none";
    }
  }

  renderOps(list, grid, section){
    grid.innerHTML = "";
    list.forEach(op=>{
      const c = document.createElement("div");
      c.className = "chip";
      c.textContent = op;
      grid.appendChild(c);
    });
    section.style.display = list.length ? "block" : "none";
  }
}
customElements.define("pantalla-detalle", PantallaDetalle);