const sdk = require('node-appwrite');

module.exports = async function (context) {
    const client = new sdk.Client();
    const users = new sdk.Users(client);

    // ربط الفنكشن بمشروعك باستخدام المتغيرات اللي ضفناها في الـ Settings
    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    let payload;
    try {
        payload = JSON.parse(context.req.body || '{}');
    } catch (e) {
        return context.res.json({ success: false, message: 'بيانات غير صالحة' });
    }

    const { email, newPassword } = payload;

    if (!email || !newPassword) {
        return context.res.json({ success: false, message: 'الإيميل والباسورد مطلوبين' });
    }

    try {
        // البحث عن المستخدم
        const userList = await users.list([sdk.Query.equal('email', email)]);
        
        if (userList.total === 0) {
            return context.res.json({ success: false, message: 'المستخدم غير موجود' });
        }

        const userId = userList.users[0].$id;

        // تحديث الباسورد بصلاحية الأدمن
        await users.updatePassword(userId, newPassword);

        return context.res.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
    } catch (err) {
        return context.res.json({ success: false, error: err.message });
    }
};