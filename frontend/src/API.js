const DOMAIN_NAME = process.env.REACT_APP_API_URL;

function getHeaders(token = "") {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (token) {
    headers.append("Authorization", `Token ${token}`);
  }

  return headers;
}

export async function login(email, password) {
  const headers = getHeaders();

  try {
    const res = await fetch(`${DOMAIN_NAME}/users/sign-in`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password }),
    });

    return await res.json();
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function signup(email, username, password) {
  const headers = getHeaders();

  try {
    const res = await fetch(`${DOMAIN_NAME}/users/sign-up`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function profile(token) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/users`, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function update(token, body) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/users`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function remove(token) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/users`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function sendReinitializationEmail(email) {
  const headers = getHeaders();

  try {
    const res = await fetch(`${DOMAIN_NAME}/users/reinitialize-password`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function confirm(token) {
  const headers = getHeaders();

  try {
    const res = await fetch(`${DOMAIN_NAME}/users/confirm/${token}`, {
      method: "POST",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Internal error." };
  }
}

export async function getBook(id, token) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/${id}`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Book not found." };
  }
}

export async function getBooks(fields, token = "") {
  const headers = getHeaders(token);

  let query = "";
  Object.keys(fields).forEach((field) => {
    query += `${field}=${fields[field]}&`;
  });

  try {
    const res = await fetch(`${DOMAIN_NAME}/books?${query}`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: "Books not found." };
  }
}

export async function sendComment(bookId, token, comment) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/comment/${bookId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        comment,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}

export async function deleteComment(commentId, token) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/comment/${commentId}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}

export async function updateComment(commentId, token, comment) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/comment/${commentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ comment }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}

export async function rateBook(token, bookId, stars) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/rate/${bookId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ stars }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}

export async function addBookToShelf(token, bookId, shelf) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/shelf/${shelf}/${bookId}`, {
      method: "POST",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}

export async function getShelf(token) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books/shelf/`, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}

export async function addBook(token, body) {
  const headers = getHeaders(token);

  try {
    const res = await fetch(`${DOMAIN_NAME}/books`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}
