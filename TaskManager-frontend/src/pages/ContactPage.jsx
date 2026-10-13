function ContactPage() {
    return (
        <section className="page-content">
            <h2>Contact</h2>
            <p className="page-description">Find the right way to get help with your workspace.</p>
            <div className="contact-grid">
                <article className="contact-card"><h3>Getting started</h3><p>Create tasks from the Tasks page, then update them as work progresses.</p></article>
                <article className="contact-card"><h3>Account help</h3><p>Use a secure password with at least eight characters when registering.</p></article>
                <article className="contact-card"><h3>Performance note</h3><p>This page is loaded on demand, keeping the first visit focused on tasks.</p></article>
            </div>
        </section>
    );
}

export default ContactPage;
