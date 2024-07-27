
exports.transformGetInquiries = (inquiries) => {

    return inquiries.map(obj => ({
        id: obj._id,
        inquiry: obj.inquiry,
        email: obj.email,
        name: obj.name || '',
        phoneNumber: obj.phoneNumber || '',
        address: obj.address || '',
        message: obj.message || '',
        subject: obj.subject || '',
    }))
};
