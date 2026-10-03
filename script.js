const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function createRepositoryItem(event) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const description = document.createElement("p");
  const meta = document.createElement("div");
  const date = document.createElement("time");
  const language = document.createElement("span");

  item.className = "repository-item";
  link.className = "repository-name";
  link.href = event.url;
  link.textContent = event.repository;
  link.target = "_blank";
  link.rel = "noreferrer";

  description.className = "repository-description";
  description.textContent = event.description;

  meta.className = "repository-meta";
  date.dateTime = event.starred_at;
  date.textContent = `Starred ${formatDate(event.starred_at)}`;
  language.className = "repository-language";
  language.textContent = event.language;

  meta.append(date, language);
  item.append(link, description, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.events)) {
      throw new Error("The repository data is not in the expected format.");
    }

    const items = data.events.map(createRepositoryItem);
    repositoryList.replaceChildren(...items);
    listStatus.textContent = items.length
      ? `${items.length} repositories`
      : "No starred repositories yet.";
  } catch (error) {
    listStatus.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();