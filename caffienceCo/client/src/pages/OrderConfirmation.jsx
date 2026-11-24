import { Link, useLocation, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import { formatPHP } from '../utils/format';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="page-shell max-w-xl py-24 text-center">
      <p className="eyebrow">Confirmed</p>
      <h1 className="section-title mt-2">Thank you</h1>
      <p className="mt-4 text-coffee">
        Reference <strong className="text-espresso">{orderNumber}</strong>
      </p>
      {order && <p className="mt-2">Total due on delivery: {formatPHP(order.total)}</p>}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/track-order">
          <Button variant="secondary">Track order</Button>
        </Link>
        <Link to="/shop">
          <Button>Shop more</Button>
        </Link>
      </div>
    </div>
  );
}