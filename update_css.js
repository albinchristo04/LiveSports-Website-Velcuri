import fs from 'fs';

const path = 'public/blogger-theme.xml';
let content = fs.readFileSync(path, 'utf8');

// Update 1: .container padding in 768px media query
const target1 = `  .container {
    padding: var(--spacing-md);
  }`;
const replace1 = `  .container {
    padding: var(--spacing-sm);
  }`;

if (content.includes(target1)) {
    content = content.replace(target1, replace1);
    console.log('Updated .container padding');
} else {
    console.log('Could not find .container padding block');
}

// Update 2: .match-container padding in 768px media query
const target2 = `  .match-container {
    padding: var(--spacing-sm);
  }`;
const replace2 = `  .match-container {
    padding: 0;
    width: 100%;
  }`;

if (content.includes(target2)) {
    content = content.replace(target2, replace2);
    console.log('Updated .match-container padding');
} else {
    console.log('Could not find .match-container padding block');
}

// Update 3: 480px media query
const target3 = `@media (max-width: 480px) {
  :root {
    --font-size-4xl: 1.5rem;
    --font-size-5xl: 1.75rem;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: var(--font-size-sm);
  }
  
  .event-header,
  .player-section {
    padding: var(--spacing-md);
  }
}`;

const replace3 = `@media (max-width: 480px) {
  :root {
    --font-size-4xl: 1.5rem;
    --font-size-5xl: 1.75rem;
  }
  
  .container {
    padding: var(--spacing-xs);
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: var(--font-size-sm);
  }
  
  .event-header,
  .match-header,
  .player-section {
    padding: var(--spacing-sm);
  }
}`;

if (content.includes(target3)) {
    content = content.replace(target3, replace3);
    console.log('Updated 480px media query');
} else {
    console.log('Could not find 480px media query block');
    // Try partial updates if full block fails
    const target3inner = `.event-header,
  .player-section {
    padding: var(--spacing-md);
  }`;
    const replace3inner = `.event-header,
  .match-header,
  .player-section {
    padding: var(--spacing-sm);
  }`;

    if (content.includes(target3inner)) {
        content = content.replace(target3inner, replace3inner);
        console.log('Updated 480px media query inner part');

        // Add .container rule to 480px root block
        const target3root = `:root {
    --font-size-4xl: 1.5rem;
    --font-size-5xl: 1.75rem;
  }`;
        const replace3root = `:root {
    --font-size-4xl: 1.5rem;
    --font-size-5xl: 1.75rem;
  }
  
  .container {
    padding: var(--spacing-xs);
  }`;

        if (content.includes(target3root)) {
            content = content.replace(target3root, replace3root);
            console.log('Updated 480px root vars');
        }
    }
}

fs.writeFileSync(path, content);
