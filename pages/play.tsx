import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { dynamoDb } from "../lib/dynamo-db";
import { createAudioData } from "../lib/audio";

interface FlashCard {
  kanji: string;
  hiragana: string;
  katakana: string;
  jp: string;
  examples: string[];
  romaji: string;
  id: string;
  pictureId: string;
  title: string;
}
interface PageProps {
  card: FlashCard;
  audio: any;
}

const Page: React.FC<PageProps> = ({ card, audio }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const click = async () => {
    setShowAnswer((answer) => !answer);

    if (showAnswer) {
      return;
    }

    const audioData = Buffer.from(audio, "hex");
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = webkitURL.createObjectURL(blob);
    const audioEl = new Audio(url);
    audioEl.load();
    audioEl.play();
  };

  return (
    <Card>
      <CardActionArea onClick={click}>
        <CardContent>
          {(!showAnswer && (
            <Typography gutterBottom variant="h5" component="div">
              {card.title}
            </Typography>
          )) || (
            <>
              <Typography gutterBottom variant="h5" component="div">
                {card.kanji}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {card.hiragana}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {card.katakana}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {card.romaji}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small">Wrong</Button>
        <Button size="small">Correct</Button>
      </CardActions>
    </Card>
  );
};

export async function getStaticProps() {
  try {
    const { Items } = await dynamoDb.scan({
      FilterExpression: "attribute_exists(title)",
    });

    const random = Math.floor(Math.random() * Items.length);
    const item = Items[random];

    const audio = await createAudioData(item.jp);

    // const { Item } = await dynamoDb.get({
    //   Key: {
    //     id: params.id,
    //   },
    // });

    // Pass data to the page via props
    return {
      props: {
        card: item,
        audio: audio.toString("hex"),
      },
    };
  } catch (err) {
    console.warn("ERROR", err);

    return { props: {} };
  }
}

export default Page;
