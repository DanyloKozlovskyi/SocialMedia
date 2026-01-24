import AccountComponent from "@widgets/account-component";
import { SearchComponent } from "@features/search";

const RightToolbar = () => {
  return (
    <div>
      <AccountComponent />
      <SearchComponent />
    </div>
  );
};

export default RightToolbar;
