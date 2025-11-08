const API = "/api/expenses";

const form = document.getElementById("expenseForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expenseList");
const totalEl = document.getElementById("total");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editingId = null;

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

async function fetchExpenses() {
    const res = await fetch(API);
    const data = await res.json();
    renderExpenses(data);
}

async function fetchTotal() {
    const res = await fetch(`${API}/total`);
    const { total } = await res.json();
    totalEl.textContent = `Total: ${formatCurrency(total)}`;
}

function renderExpenses(list) {
    expenseList.innerHTML = "";
    if (!Array.isArray(list) || list.length === 0) {
        expenseList.innerHTML = "<li class='small'>Nenhuma despesa cadastrada.</li>";
        totalEl.textContent = "Total: R$ 0,00";
        return;
    }
    list.forEach((exp) => {
        const li = document.createElement("li");

        const left = document.createElement("div");
        left.className = "item-left";
        left.innerHTML = `<strong>${exp.description}</strong><span class="small">${formatDate(exp.date)}</span>`;

        const right = document.createElement("div");
        right.style.display = "flex";
        right.style.alignItems = "center";
        right.innerHTML = `<div style="min-width:120px;text-align:right;margin-right:12px;">${formatCurrency(exp.amount)}</div>`;

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.textContent = "Alterar";
        editBtn.onclick = () => startEdit(exp);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "Excluir";
        deleteBtn.onclick = () => handleDelete(exp._id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        right.appendChild(actions);

        li.appendChild(left);
        li.appendChild(right);

        expenseList.appendChild(li);
    });
}

function startEdit(exp) {
    editingId = exp._id;
    descriptionInput.value = exp.description;
    amountInput.value = exp.amount;
    // set date input as yyyy-mm-dd
    const d = new Date(exp.date);
    const iso = d.toISOString().slice(0, 10);
    dateInput.value = iso;
    saveBtn.textContent = "Salvar Alteração";
    cancelEditBtn.style.display = "inline-block";
}

cancelEditBtn.addEventListener("click", () => {
    editingId = null;
    form.reset();
    saveBtn.textContent = "Cadastrar Despesa";
    cancelEditBtn.style.display = "none";
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    // format date as dd/mm/yyyy for backend parser (it also accepts ISO)
    const dateVal = dateInput.value;
    let date = "";
    if (dateVal) {
        const d = new Date(dateVal);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        date = `${dd}/${mm}/${yyyy}`;
    }

    if (!description) return alert("Descrição é obrigatória.");
    if (isNaN(amount) || amount < 0) return alert("Valor inválido. Deve ser >= 0.");

    const payload = { description, amount, date: date || undefined };

    try {
        if (editingId) {
            const res = await fetch(`${API}/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro ao alterar");
            }
            editingId = null;
            saveBtn.textContent = "Cadastrar Despesa";
            cancelEditBtn.style.display = "none";
        } else {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro ao cadastrar");
            }
        }

        form.reset();
        await fetchExpenses();
        await fetchTotal();
    } catch (err) {
        alert(err.message || "Erro desconhecido");
    }
});

async function handleDelete(id) {
    if (!confirm("Deseja realmente excluir essa despesa?")) return;
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.status === 204) {
        await fetchExpenses();
        await fetchTotal();
    } else {
        const err = await res.json();
        alert(err.error || "Erro ao excluir");
    }
}

// init
(async function init() {
    await fetchExpenses();
    await fetchTotal();
})();
