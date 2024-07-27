const config = require("../config/config");
const { sendEmail, encryptData, encryptPassword } = require("./functions");
const { getWelcomeEmailImagesUrl } = require('../utils/functions');


const sendVerifyEmailOTP = async (obj) => {

    const msg = {
        to: obj.email,
        subject: 'GLIVE Verify OTP Code',
        html: `<h1>Your GLIVE App One-Time PIN (OTP) is:${obj.code}<h1>`
    }

    await sendEmail(msg);
}

const sendEMAILChangePassword = async (obj) => {
    const deeplinkURL = `${config.mobileDeeplinkUrl}?page=forgot-password&token=${encryptData(obj.id)}`;

    const msg = {
        to: obj.email,
        subject: 'GLIVE Forgot Password',
        html: `<div class="card">
        <div style="padding: 3.5rem;">
            <div class="mb-2 font_style">
                Please <a href="${deeplinkURL}">Click Me </a> to change your password
            </div>
        </div>
    </div>`
    }

    await sendEmail(msg);
}

const sendEMAILOTP = async (other) => {
    const userEmail = other.email;
    const msg = {
        to: userEmail,
        subject: `Unleash Email OTP`,
        html: `<div class="card">
                    <div style="padding: 3.5rem;">
                        <div class="mb-2 font_style">
                            Your Unleash App One-Time PIN (OTP) is:${other.emailOTP.code}
                        </div>
                    </div>
                </div>`
    };

    await sendEmail(msg);
};

const sendEMAILOTPForgotPassword = async (other) => {
    const userEmail = other.email;
    const msg = {
        to: userEmail,
        subject: `Unleash Email OTP`,
        html: `<div class="card">
                    <div style="padding: 3.5rem;">
                        <div class="mb-2 font_style">
                            Your Unleash App One-Time PIN (OTP) is:${other.emailOTPForgotPassword.code}
                        </div>
                    </div>
                </div>`
    };

    await sendEmail(msg);
};

const sendRequestDeleteAccount = async (other) => {
    const userEmail = other.email;
    const url = `${config.baseUrlApi}/public/confirm-delete-account?token=${encryptPassword(other._id)}`;

    const msg = {
        to: userEmail,
        subject: `Unleash User Request Delete Account`,
        html: `<div class="card">
                <div style="padding: 3.5rem;">
                    <div class="mb-2 font_style">
                        Please click this <a href="${url}">Link</a> to confirm your request to delete your account
                    </div>
                </div>
            </div>`
    };

    await sendEmail(msg);
};

// const getWelcomeImages = async () => {
//     const background = await getWelcomeEmailImagesUrl('Background.png');
//     const email = await getWelcomeEmailImagesUrl('Email.png');
//     const fbIcon = await getWelcomeEmailImagesUrl('facebook.png');
//     const igIcon = await getWelcomeEmailImagesUrl('isntagram.png');
//     const line = await getWelcomeEmailImagesUrl('Line.png');
//     const pawLeft = await getWelcomeEmailImagesUrl('Paw_left.png');
//     const pawRight = await getWelcomeEmailImagesUrl('Paw_rigth.png');
//     const petBg = await getWelcomeEmailImagesUrl('Pet_BG.png');
//     const unleashLogo = await getWelcomeEmailImagesUrl('Unleash_Logo.png');
//     const web = await getWelcomeEmailImagesUrl('Web.png');
//     const x = await getWelcomeEmailImagesUrl('x.png');

//     return {
//         background,
//         email,
//         fbIcon,
//         igIcon,
//         line,
//         pawLeft,
//         pawRight,
//         petBg,
//         unleashLogo,
//         web,
//         x
//     }
// }

const sendWelcomeEmail = async (other) => {
    const userEmail = other.email;
    const userName = other.name;
    const userReferral = other.referralCode

    const background = await getWelcomeEmailImagesUrl('Background.png');
    const email = await getWelcomeEmailImagesUrl('Email.png');
    const fbIcon = await getWelcomeEmailImagesUrl('facebook.png');
    const igIcon = await getWelcomeEmailImagesUrl('isntagram.png');
    const line = await getWelcomeEmailImagesUrl('Line.png');
    const pawLeft = await getWelcomeEmailImagesUrl('Paw_left.png');
    const pawRight = await getWelcomeEmailImagesUrl('Paw_rigth.png');
    const petBg = await getWelcomeEmailImagesUrl('Pet_BG.png');
    const unleashLogo = await getWelcomeEmailImagesUrl('Unleash_Logo.png');
    const web = await getWelcomeEmailImagesUrl('Web.png');
    const x = await getWelcomeEmailImagesUrl('x.png');

    const webLink = 'https://unleash.ph/'
    const emailLink = 'mailto: support@unleash.ph'
    const fbLink = 'https://www.facebook.com/unleashphofficial/?show_switched_toast=0&show_invite_to_follow=0&show_switched_tooltip=0&show_podcast_settings=0&show_community_review_changes=0&show_community_rollback=0&show_follower_visibility_disclosure=0'
    const igLink = 'https://www.instagram.com/unleashphofficial/'
    const xLink = 'https://twitter.com/UnleashPetApp'

    const msg = {
        to: userEmail,
        subject: `Welcome to Unleash`,
        html: `<div class="card">
        <div style="padding: 3.5rem;">
            <div class="mb-2 font_style">
                <div style='width:600px; height: 343px; background: url(${petBg}) no-repeat'>
                    <div style="padding-top: 40px;">
                        <div style="margin-left: 250px; color: #2c3e50;">Welcome to</div>
                        <img style="margin-left: 180px; height: 140px;" src="${unleashLogo}" alt="unleash logo">
                    </div>
                </div>
                <div style='width:600px; background: url("${background}") no-repeat; background-position: center bottom;'>
                    <div style="width: 600px;">
                        <img style="margin-left: 30px; float: left; padding-top: 50px;" src="${pawLeft}" alt="paw left">
                        <img style="margin-right: 30px; float: right; padding-top: 50px;" src="${pawRight}" alt="paw right">
                        <div style="position: relative; margin-left: 160px; padding-top: 50px;">
                            <div style="font-size: 1.3em;">HELLO, <span style="font-weight: bold; font-size: 1.3em;">${userName}</span> HOOMAN!</div>
                            <img style="margin-top: 10px; height: 16px; width: 279px; " src="${line}" alt="line">
                        </div>
                    </div>
                    <div style="margin-top: 60px; font-size: 1.1rem; width: 550px; text-align: center; margin-left: 25px; color: #2c3e50;">
                        Exciting adventures await you and your pet companion in our app.
                    </div>
                    <div style="margin-top: 20px; font-size: 1.1rem; width: 550px; margin-left: 25px; text-align: center; color: #2c3e50;">
                        Unleash is a pet lifestyle application that is designed to provide you and your loved one a special place to play,
                        meet, explore and have fun!
                    </div>
                    <div style="margin-top: 20px; font-size: 1.1rem; width: 550px; margin-left: 25px; text-align: center; color: #2c3e50;">
                        Refer your friends and family and let them use your referral code:
                    </div>
                    <div style="margin-top: 40px; border-width: 1.3rem; border-radius: 25px; margin-left: 65px; padding: 20px; border: 1px solid #F28241; width: 400px; text-align: center; font-weight: bold; font-size: 1.3rem; color: #2c3e50;">${userReferral}</div>
                    <div style="margin-top: 40px; width: 600px; text-align: center; font-size: 1.1rem; color: #2c3e50;">Stay tuned as we release new features weekly!</div>
                    <img style="margin-top: 40px; margin-left: 100px; height: 240px;" src="${unleashLogo}" alt="unleash logo">
                    <div style="background: #418EF2; width: 600px;">
                        <div style="padding: 20px; margin-left: 220px; color: #ecf0f1; font-size: 1.2rem;">TALK TO US!</div>
                        <div style="display: inline-block; width: 600px; padding-bottom: 20px;">
                            <div style="background: #fff; width: 50px; height: 50px; border-radius: 20px; float: left; margin-left: 150px; margin-right: 15px;">
                                <a href="${emailLink}"><img style="height: 30px; margin-left: 0px; margin-top: 10px; margin-left: 10px;" src="${email}" alt="email icon"></a>
                            </div>
                            <div style="background: #fff; width: 50px; height: 50px; border-radius: 20px; float: left; margin-right: 15px;">
                                <a href="${webLink}"><img style="height: 30px; margin-left: 0px; margin-top: 10px; margin-left: 10px;" src="${web}" alt="web icon"></a>
                            </div>
                            <div style="background: #fff; width: 50px; height: 50px; border-radius: 20px; float: left; margin-right: 15px;">
                                <a href="${fbLink}"><img style="height: 30px; margin-left: 0px; margin-top: 10px; margin-left: 10px;" src="${fbIcon}" alt="facebook icon"></a>
                            </div>
                            <div style="background: #fff; width: 50px; height: 50px; border-radius: 20px; float: left; margin-right: 15px;">
                                <a href="${igLink}"><img style="height: 30px; margin-left: 0px; margin-top: 10px; margin-left: 10px;" src="${igIcon}" alt="instagram icon"></a>
                            </div>
                            <div style="background: #fff; width: 50px; height: 50px; border-radius: 20px; float: left; margin-right: 15px;">
                                <a href="${xLink}"><img style="height: 30px; margin-left: 0px; margin-top: 10px; margin-left: 10px;" src="${x}" alt="twitter icon"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    };

    await sendEmail(msg);
};


module.exports = {
    sendVerifyEmailOTP,
    sendEMAILChangePassword,
    sendEMAILOTP,
    sendRequestDeleteAccount,
    sendWelcomeEmail,
    sendEMAILOTPForgotPassword
}