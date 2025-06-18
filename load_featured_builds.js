async function loadFeaturedBuilds() {
    try {
        const response = await fetch('featured_builds.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        const container = document.getElementById('featured-builds-row');
        if (!container) {
            console.error('Error: Featured builds container not found.');
            return;
        }
        container.innerHTML = ''; // Clear existing content

        projects.forEach(project => {
            const projectCol = document.createElement('div');
            // Using col-lg-4 for a 3-column layout on large screens, adjust as needed
            projectCol.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';

            const card = document.createElement('div');
            // Applying classes similar to what might be used by Softr for consistency
            card.className = 'card sw-background-color-ffffff sw-box-shadow-m sw-border-radius-l';
            card.style.height = '100%'; // Ensure cards have same height for alignment

            if (project.imageUrl) {
                const img = document.createElement('img');
                img.src = project.imageUrl;
                img.alt = project.title;
                // Classes for image styling, trying to match original_yohei.html structure
                img.className = 'card-img-top sw-height-3xs';
                img.style.objectFit = 'cover'; // Or 'contain' depending on desired image fit
                img.style.borderTopLeftRadius = '.5rem'; // Match card roundness
                img.style.borderTopRightRadius = '.5rem';
                card.appendChild(img);
            }

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column p-4';

            const title = document.createElement('h6');
            // Applying Softr-like classes for title
            title.className = 'card-title sw-font-size-s sw-text-color-default sw-font-family-default sw-font-weight-semibold sw-margin-top-6xs';
            title.textContent = project.title;
            cardBody.appendChild(title);

            const description = document.createElement('p');
            // Applying Softr-like classes for description
            description.className = 'card-text sw-font-size-s sw-text-color-default sw-font-family-default sw-font-weight-normal sw-line-height-normal sw-letter-spacing-normal';
            description.textContent = project.description;
            cardBody.appendChild(description);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'mt-auto text-center'; // text-center for button alignment

            if (project.githubLink) {
                const githubButton = document.createElement('a');
                githubButton.href = project.githubLink;
                githubButton.target = '_blank';
                // Applying Softr-like classes for button
                githubButton.className = 'btn btn-primary sw-font-size-m sw-text-color-default sw-font-family-default sw-font-weight-semibold sw-border-radius-default sw-background-color-default sw-padding-left-2xs sw-padding-right-2xs sw-padding-top-5xs sw-padding-bottom-5xs sw-border-style-none sw-display-inline-block m-1';
                githubButton.textContent = 'GitHub';
                buttonGroup.appendChild(githubButton);
            }

            if (project.demoLink && project.demoLink.trim() !== "") {
                const demoButton = document.createElement('a');
                demoButton.href = project.demoLink;
                demoButton.target = '_blank';
                // Using a secondary button style, adjust classes for your theme
                demoButton.className = 'btn btn-outline-primary sw-font-size-m sw-font-family-default sw-font-weight-semibold sw-border-radius-default sw-padding-left-2xs sw-padding-right-2xs sw-padding-top-5xs sw-padding-bottom-5xs sw-border-style-solid m-1';
                demoButton.style.color = '#212121'; // Default button text color
                demoButton.style.borderColor = '#212121'; // Default button background color as border
                demoButton.textContent = 'Demo';
                buttonGroup.appendChild(demoButton);
            }
            cardBody.appendChild(buttonGroup);
            card.appendChild(cardBody);
            projectCol.appendChild(card);
            container.appendChild(projectCol);
        });
    } catch (error) {
        console.error('Error loading featured builds:', error);
    }
}

// Call the function when the DOM is ready
document.addEventListener('DOMContentLoaded', loadFeaturedBuilds);
