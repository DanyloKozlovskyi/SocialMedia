import SignInIcon from "@assets/auth/sign-in.svg";
import styles from "./auth-layout.module.scss";

const AuthLayout = ({ children, ...props }: { children: React.ReactNode }) => {
  return (
    <div {...props} className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <SignInIcon className={styles.illustration} />
        </div>
        <div className={styles.right}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
