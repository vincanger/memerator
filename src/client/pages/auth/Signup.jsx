import React from "react";
import { Link } from "react-router-dom";
import { SignupForm } from "@wasp/auth/forms/Signup";

export default function Signup() {
  return (
    <div className="w-full h-full bg-white">
      <div className="min-w-full min-h-[75vh] flex items-center justify-center">
        <div className="w-full h-full max-w-sm p-5 bg-white">
          <div>
            <SignupForm
              appearance={{
                colors: {
                  brand: 'var(--auth-form-brand)',
                  brandAccent: 'var(--auth-form-brand-accent)',
                  submitButtonText: 'var(--auth-form-submit-button-text-color)',
                }
              }}
            />
            <div className="mt-4 text-center">
              If you already have an account go to{" "}
              <Link to="/login" className="text-primary-500 hover:text-primary-800 underline">
                login
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}