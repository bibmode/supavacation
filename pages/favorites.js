import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { prisma } from "@/lib/prisma";
import { useEffect } from "react";

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your favorites</h1>
      <p className="text-gray-500">Manage your saved listings</p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const homes = await prisma.user.findMany({
    where: { email: session.user.email },
    select: { favoriteHomes: true },
  });

  const data = await JSON.parse(JSON.stringify(homes));

  return {
    props: {
      homes: data[0].favoriteHomes,
    },
  };
};

export default Favorites;
