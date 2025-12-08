const AdminPage = () => {
    return (
        <div>
            <section>
                <h2>Halaman Admin</h2>
                <p>Hanya role <strong>admin</strong> yang boleh mengakses halaman ini.</p>
                <ul>
                    <li>Kelola user</li>
                    <li>Kelola kategori masalah</li>
                    <li>Konfigurasi sistem</li>
                </ul>
            </section>
        </div>
    )
}

export default AdminPage
