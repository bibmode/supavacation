import PropTypes from "prop-types";
import Card from "@/components/Card";
import { ExclamationIcon } from "@heroicons/react/outline";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const Grid = ({ homes = [] }) => {
  const isEmpty = homes.length === 0;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  const getFavoritedHomes = async () => {
    const { data } = await axios.get(`/api/user/favorites`);
    data[0]?.favoriteHomes && setFavorites(data[0].favoriteHomes);
  };

  const findFavorite = (homeId) => {
    const found = favorites.find((item) => item.id === homeId);

    return found ? true : false;
  };

  useEffect(() => {
    getFavoritedHomes();
  }, []);

  const toggleFavorite = async (id) => {
    // TODO: Add/remove home from the authenticated user's favorites
    const findId = favorites?.filter((home) => home.id === id);

    if (findId.length) {
      try {
        await axios.delete(`/api/homes/${id}/favorite`, {
          id,
        });
        getFavoritedHomes();
      } catch (error) {
        toast.error("bad");
      }
    } else {
      try {
        await axios.put(`/api/homes/${id}/favorite`, {
          id,
        });
        getFavoritedHomes();
      } catch (error) {
        toast.error("bad");
      }
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card
          key={home.id}
          {...home}
          favorite={findFavorite(home.id)}
          onClickFavorite={() => toggleFavorite(home.id)}
        />
      ))}
    </div>
  );
};

Grid.propTypes = {
  homes: PropTypes.array,
};

export default Grid;
