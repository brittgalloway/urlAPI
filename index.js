/* ============================================================
   SHORTLY — index.js
   - Mobile nav toggle
   - URL shortening via urlvanish.com API
   - Results list rendering
   - Copy to clipboard
   ============================================================ */

'use strict';

/* ── DOM refs ─────────────────────────────────────────────── */
const $navToggle   = document.querySelector('.nav-toggle');
const $primaryNav  = document.querySelector('#primary-nav');
const $form        = document.querySelector('.shortener__form');
const $input       = document.querySelector('#url-input');
const $errorMsg    = document.querySelector('#url-error');
const $resultsList = document.querySelector('.results-list');

/* ── 1. MOBILE NAV TOGGLE ─────────────────────────────────── */

$navToggle.addEventListener('click', () => {
  const isOpen = $primaryNav.classList.toggle('is-open');
  $navToggle.setAttribute('aria-expanded', isOpen);
  $navToggle.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation menu' : 'Open navigation menu'
  );
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!$primaryNav.contains(e.target) && !$navToggle.contains(e.target)) {
    $primaryNav.classList.remove('is-open');
    $navToggle.setAttribute('aria-expanded', 'false');
    $navToggle.setAttribute('aria-label', 'Open navigation menu');
  }
});

// Close nav on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $primaryNav.classList.contains('is-open')) {
    $primaryNav.classList.remove('is-open');
    $navToggle.setAttribute('aria-expanded', 'false');
    $navToggle.setAttribute('aria-label', 'Open navigation menu');
    $navToggle.focus();
  }
});


/* ── 2. VALIDATION ────────────────────────────────────────── */

function showError(message) {
  $errorMsg.textContent = message;
  $errorMsg.hidden = false;
  $input.setAttribute('aria-invalid', 'true');
}

function clearError() {
  $errorMsg.hidden = true;
  $input.removeAttribute('aria-invalid');
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}


/* ── 3. API CALL ──────────────────────────────────────────── */

async function shortenUrl(longUrl) {
  const response = await fetch('https://urlvanish.com/create_api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl: longUrl }),
  });

  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data.alias;
}
/* ── 4. RESULTS RENDERING ─────────────────────────────────── */

function createResultItem(originalUrl, shortUrl) {
  const li = document.createElement('li');
  li.className = 'results-list__item';

  li.innerHTML = `
    <span class="results-list__original" title="${originalUrl}">${originalUrl}</span>
    <div class="results-list__short-group">
      <a
        href="${shortUrl}"
        class="results-list__short-link"
        target="_blank"
        rel="noopener noreferrer"
      >${shortUrl}</a>
      <button
        class="btn results-list__copy-btn"
        aria-label="Copy shortened link ${shortUrl}"
        data-link="${shortUrl}"
      >
        Copy
      </button>
    </div>
  `;

  return li;
}

function prependResult(originalUrl, shortUrl) {
  const item = createResultItem(originalUrl, shortUrl);
  // Newest result at the top
  $resultsList.prepend(item);
}


/* ── 5. COPY TO CLIPBOARD ─────────────────────────────────── */

// Event delegation — handles all copy buttons, including future ones
$resultsList.addEventListener('click', async (e) => {
  const $btn = e.target.closest('.results-list__copy-btn');
  if (!$btn) return;

  const shortUrl = $btn.dataset.link;

  try {
    await navigator.clipboard.writeText(shortUrl);

    // Visual + accessible feedback
    $btn.textContent = 'Copied!';
    $btn.classList.add('is-copied');
    $btn.setAttribute('aria-label', `Copied ${shortUrl}`);

    // Reset after 2s
    setTimeout(() => {
      $btn.textContent = 'Copy';
      $btn.classList.remove('is-copied');
      $btn.setAttribute('aria-label', `Copy shortened link ${shortUrl}`);
    }, 2000);

  } catch {
    $btn.textContent = 'Failed';
    setTimeout(() => {
      $btn.textContent = 'Copy';
    }, 2000);
  }
});


/* ── 6. FORM SUBMIT ───────────────────────────────────────── */

$form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const rawValue = $input.value.trim();

  // Client-side validation
  if (!rawValue) {
    showError('Please add a link');
    $input.focus();
    return;
  }

  if (!isValidUrl(rawValue)) {
    showError('Please enter a valid URL (include https://)');
    $input.focus();
    return;
  }

  clearError();

  // Loading state
  const submitBtn = $form.querySelector('.shortener__btn');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Shortening…';
  submitBtn.disabled = true;

  try {
    const shortUrl = await shortenUrl(rawValue);
    prependResult(rawValue, shortUrl);
    $input.value = '';
    $input.focus();
  } catch (err) {
    showError(err.message);
  } finally {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
});