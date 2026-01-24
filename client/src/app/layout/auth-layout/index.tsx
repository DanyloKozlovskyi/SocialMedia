import SignInIcon from "@assets/auth/sign-in.svg";
import SignUpIcon from "@assets/auth/sign-up.svg";
import styles from "./auth-layout.module.scss";

const AuthLayout = ({
  children,
  signIn,
  ...props
}: {
  children: React.ReactNode;
  signIn: boolean;
}) => {
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
