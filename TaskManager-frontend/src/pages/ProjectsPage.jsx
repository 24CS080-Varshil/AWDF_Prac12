function ProjectsPage({ tasks }) {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.length - completed;
    const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

    return (
        <section className="page-content">
            <h2>Projects overview</h2>
            <p className="page-description">A focused view of progress across your current work.</p>
            <div className="overview-grid">
                <article className="metric-card"><span>Total tasks</span><p className="metric-value">{tasks.length}</p></article>
                <article className="metric-card"><span>Pending</span><p className="metric-value">{pending}</p></article>
                <article className="metric-card"><span>Complete</span><p className="metric-value">{completionRate}%</p></article>
            </div>
        </section>
    );
}

export default ProjectsPage;
