import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDf2nfOINIMor0or-r7ricZ06qt-H18XUw",
  authDomain: "mamdaisy-24a4b.firebaseapp.com",
  projectId: "mamdaisy-24a4b",
  storageBucket: "mamdaisy-24a4b.firebasestorage.app",
  messagingSenderId: "689045411991",
  appId: "1:689045411991:web:b29221a98143da3ebbf1d2",
  measurementId: "G-HQ2Q03V6NH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setDate(now.getDate() + 1);
    targetTime.setHours(19, 0, 0, 0); // 7:00 PM Tomorrow

    const difference = targetTime - now;

    return difference > 0
      ? {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      : { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="text-danger">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

const EventRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // ✅ Send data to Firebase
      await addDoc(collection(db, "21marchevent"), values);
      messageApi.open({ type: "success", content: " Form submitted successfully!" });

      // ✅ Send data to Web3Forms
      const web3formData = new FormData();
      web3formData.append("access_key", "c1a37279-9a94-43e1-8c8b-29387f558a8d");
      Object.entries(values).forEach(([key, value]) => {
        web3formData.append(key, value);
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3formData,
      });

      const result = await response.json();

      if (result.success) {
        messageApi.open({
          type: "success",
          content: " Registration submitted successfully! You will receive a confirmation email.",
        });
        form.resetFields();
      } else {
        messageApi.open({ type: "error", content: " Error sending email: " + result.message });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: " Error submitting form: " + error.message });
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid d-flex flex-lg-row flex-column">
      {contextHolder}

      <div className="col-lg-7 col-12 d-flex flex-column justify-content-center bg_c">
        <h1 className="text-white display-4 fw-bold ps-3">MAM DAISY</h1>
        <h6 className="text-white fs-2 fw-normal ps-3">Ramzan Festival</h6>

        <div className="bottom_div d-flex flex-lg-row flex-column justify-content-lg-around py-3 col-12 mx-auto">
          <span className="text-white px-3 d-flex flex-column text-start">
            <i className="fa-solid fa-calendar-days pb-2"></i> 21-MARCH-2025
          </span>
          <span className="text-white px-3 d-flex flex-column text-start">
            <i className="fa-solid fa-clock pb-2"></i>7.00 PM - 2.00 AM
          </span>
          <span className="text-white px-3 d-flex flex-column text-start lh-1">
            <i className="fa-solid fa-location-dot pb-2"></i>Habit City, Main Shahrah-e-Faisal <br /> Karachi
          </span>
        </div>
      </div>

      <div className="col-lg-5 px-3 col-12 d-flex flex-column justify-content-center">
        <h2 className="fw-normal mb-3">Event Registration</h2>

        {/* Countdown Timer */}
        <div className="mb-3">
          <span>Time Left : </span> <CountdownTimer />
        </div>

        <Form layout="vertical" className="d-flex flex-column justify-content-center" form={form} onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input placeholder="Email Address" />
          </Form.Item>
          <Form.Item name="contact" rules={[{ required: true, message: "Please enter your contact number" }]}>
            <Input placeholder="Contact Number" />
          </Form.Item>
          <Form.Item name="source" rules={[{ required: true }]}>
            <Select placeholder="How did you hear about this event?">
              <Select.Option value="family">Family</Select.Option>
              <Select.Option value="social_media">Social Media</Select.Option>
              <Select.Option value="friends">Friends or Colleagues</Select.Option>
              <Select.Option value="advertisement">Online Advertisement</Select.Option>
              <Select.Option value="email">Email or Newsletter</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="first_time" rules={[{ required: true }]}>
            <Select placeholder="Is this your first experience with Mam Daisy?">
              <Select.Option value="yes">Yes</Select.Option>
              <Select.Option value="no">No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" rules={[{ required: true }]}>
            <Select placeholder="Are you a visitor or vendor?">
              <Select.Option value="visitor">Visitor</Select.Option>
              <Select.Option value="vendor">Vendor</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" className="ff" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
