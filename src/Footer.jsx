import React from "react";
import { Box, Typography, Link } from "@material-ui/core";

const Footer = () => {
  return (
    <Box
      my={2}
      p={4}
      color="bkgs.mainAlt"
      bgcolor="bkgs.contentAlt"
      borderRadius={16}
    >
      <Typography variant="h4">How to use it</Typography>
      <Typography variant="body1">
        - <b>Buy Price</b> is on your own island.
        <br />- Prices Changes <b>twice a day</b>. Be sure to log it. (We save
        your data in your device). <br />- This calculator can trow more precise
        numbers with more data.
      </Typography>
      <Typography variant="h4">About</Typography>
      <Typography variant="body1">
        This wouldn&apos;t be possible without{" "}
        <Link href="https://twitter.com/_Ninji/status/1244818665851289602">
          @_Ninji&apos;s
        </Link>{" "}
        effort. <br />I got this inspiration from{" "}
        <Link href="https://mikebryant.github.io/ac-nh-turnip-prices/index.html">
          mikebryant&apos;s
        </Link>{" "}
        work. Finally, but not last, my brother&apos;s help with design.
        He&apos;s game dev! Follow him on twitter:{" "}
        <Link href="https://twitter.com/Consalv0">@Consalv0</Link>.
      </Typography>
    </Box>
  );
};

export default Footer;
