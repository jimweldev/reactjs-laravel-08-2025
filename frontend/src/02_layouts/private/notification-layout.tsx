import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const NotificationLayout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const link = searchParams.get('link');
    if (link) {
      navigate(link, { replace: true });
    }
  }, [navigate, searchParams]);

  return <div>asdasd</div>;
};

export default NotificationLayout;
