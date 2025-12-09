export const adminRoleController = (req, res) => {
  res.json({
    message: 'Hanya admin yang bisa melihat data ini',
    // nanti bisa ambil dari DB
  })
}

export const userInfo = (req, res) => {
  res.json({
    username: req.user.preferred_username,
    email: req.user.email,
    roles: req.user.realm_access?.roles || [],
  })
}