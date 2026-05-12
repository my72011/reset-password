const sdk = require('node-appwrite');

module.exports = async function (context) {
    const client = new sdk.Client();
    const users = new sdk.Users(client);

    // ربط الفنكشن بمشروعك
    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    let payload;
    try {
        payload = JSON.parse(context.req.body || '{}');
    } catch (e) {
        return context.res.json({ success: false, message: 'بيانات غير صحيحة' });
    }

    const { email, newPassword } = payload;

    try {
        // البحث عن المستخدم وتحديثه
        const userList = await users.list([sdk.Query.equal('email', email)]);
        if (userList.total === 0) return context.res.json({ success: false, message: 'الإيميل غير مسجل' });

        await users.updatePassword(userList.users[0].$id, newPassword);
        return context.res.json({ success: true, message: 'تم التغيير بنجاح' });
    } catch (err) {
        return context.res.json({ success: false, error: err.message });
    }
};
