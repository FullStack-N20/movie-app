export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = (email, otp) => {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  return `OTP ${otp} sent to ${email}`;
};
