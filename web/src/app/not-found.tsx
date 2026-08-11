import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section-y text-center">
      <h1 className="headline">페이지를 찾을 수 없습니다</h1>
      <p className="lead mx-auto mt-4 max-w-md">
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        홈으로 가기
      </Link>
    </div>
  );
}
